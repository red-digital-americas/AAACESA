import { Component, ViewEncapsulation, OnInit, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsLocaleService } from 'ngx-bootstrap';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Exportacion
import { PrealertaBusqueda, PrealertaSeguimiento, Documento, PrealertaNuevo, EstatusTransferencia } from '../../models/prealertas.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ExportacionBusqueda, ExportacionNuevo, ExportacionSeguimiento } from '../../models/exportaciones.model';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-exportaciones',
  templateUrl: './exportaciones.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss',
    './exportaciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class ExportacionesComponent {  
  
  loading = false;  
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  ///////////////////////
  // Catalogos para los <select>
  estatusCatalogo = [];

  ///////////////////////
  // BusquedaSuperior  
  busquedaModel:ExportacionBusqueda = new ExportacionBusqueda();    
  rangoFechaSearch:any = [];
  estatusSearch:any = "";  

  ///////////////////////
  // Status Filter Bar
  public statusEnum = ['Solicitada', 'Rechazada', 'Pendiente Cliente', 'Pendiente AAACESA', 'Aceptada', 'Finalizada', 'Cancelada'];  
  public statusLabels = ['Solicitada', 'Rechazada', 'P.Cliente', 'P.AAACESA', 'Aceptada', 'Finalizada', 'Cancelada'];  
  public countStatus = [0, 0, 0, 0, 0, 0, 0];
  public currentFilterIndex = this.statusEnum.length;
  
  ///////////////////////
  // Mat Table  
  public data = [];                         // Data original consultada del servicio  
  public detailData = {};                   // Registro con el detalle obtenido
  public estatusTransferencia = [];         // EstatusTransferenciaDetalle
  dataSource = new MatTableDataSource();    // Data usada en la Mat Table

  displayedColumns: string[] = ['IdExportacion', 'Master', 'House', 'Pedimento', 'FechaEntradaMercancia', 'FechaCreacion', 'Estatus', 'Acciones'];    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Registros por página";
    this.dataSource.sort = this.sort;     
    this.dataSource.sortingDataAccessor = (item, property) => {      
      switch (property) {     
        case 'FechaEntradaMercancia': {              
          let f = item['FechaEntradaMercancia'].split(' ')[0];                // 07/05/2019 12:00 PM          
          f = `${f.slice(3,5)}/${f.slice(0,2)}/${f.slice(6,10)}`;   // 05/07/2019          
          let newDate = new Date(f);          
          return newDate;
        }

        case 'FechaCreacion': {              
          let f = item['FechaCreacion'].split(' ')[0];                // 07/05/2019 12:00 PM          
          f = `${f.slice(3,5)}/${f.slice(0,2)}/${f.slice(6,10)}`;   // 05/07/2019          
          let newDate = new Date(f);          
          return newDate;
        }

        default: { return item[property];} 
      }
    };
  }   

  ///////////////////////////////
  // Seguimiento
  modelSeguimiento:ExportacionSeguimiento = new ExportacionSeguimiento();
  @ViewChild('externalPdfViewer') public externalPdfViewer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC SECTION    
  
  constructor(private http: Http, private apiService:ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar, private localeService: BsLocaleService) {
    this.localeService.use('es');
    this.buscaExportacionesNueva();    
 
    this.apiService.service_general_get('/Catalogos/GetCatalogoEstatus')
      .subscribe ( 
      (response:any) => { this.estatusCatalogo = response;}, 
      (errorService) => {  });
  }

  //////////////////////////
  // Status Filter Bar Logic
  public updateCountStatus () {    
    for (let i=0; i < this.statusEnum.length; i++) {
      this.countStatus[i] = this.data.filter( (el) => {return el.Estatus === this.statusEnum[i]; }).length;
    }    
  }

  public applyFilter(index: number) {
    this.dataSource.data = [];
    this.currentFilterIndex = index;

    if (index < this.statusEnum.length) {
      this.dataSource.data = this.data.filter (function (el) { return  el.Estatus === this.statusEnum[index]; }.bind(this));
    } else {
      this.dataSource.data = this.data;
    }
  }  
  
  public buscarExportaciones () {    
    this.loading = true;

    // Estatus seleccionado "Niguno"
    if (typeof this.busquedaModel.Estatus === "undefined"){
      this.busquedaModel.Estatus = "";
    }           

    // FechaInicial - FechaFinal
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){                     
        this.busquedaModel.FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaModel.FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {    
      this.busquedaModel.FechaInicial = "";
      this.busquedaModel.FechaFinal = "";
    }    
    // console.log(this.busquedaModel);
    this.apiService.service_general_get_with_params('/Exportacion/Busqueda', this.busquedaModel)
      .subscribe ( 
      (response:any) => {                 
        this.data = response;        
        this.dataSource.data = this.data;
        this.updateCountStatus();
        this.currentFilterIndex = this.statusEnum.length;
        this.loading = false;
      }, 
      (errorService) => { this.loading = false;});            
  }

  buscaExportacionesNueva () {
    this.busquedaModel.Clean();    
    this.rangoFechaSearch = "";
    this.buscarExportaciones();
  }

  public verDetalle (id: string) {    
    this.loading = true;
    this.detailData = {};
    this.modelSeguimiento.cleanSeguimiento();      
    
    this.apiService.service_general_get(`/Exportacion/GetDetailsById/${id}`)
    .subscribe ( 
    (response:any) => { 
      this.detailData = response;       
      this.loading = false;
    }, 
    (errorService) => { this.loading = false; });    
  } 

  ///////////////////////////////
  // Update Seguimiento
  public updateSeguimiento (estado:string) {
    if (estado==="Cancelada" && this.modelSeguimiento.Documentos.length > 0) { 
      this.showAlert("No se pueden enviar documentos al cancelar"); return;
    }

    this.loading = true;
    this.modelSeguimiento.IdExportacion = this.detailData['IdExportacion'];
    this.modelSeguimiento.Estatus = estado;
    // console.log(this.modelSeguimiento);  
    
    this.apiService.service_general_put(`/Exportacion/UpdateSeguimiento`, this.modelSeguimiento)
      .subscribe ( 
      (response:any) => { 
        // console.log(response); 
        if (response.Result) {                 
          this.showAlert(response.Description);
          this.verDetalle(this.detailData['IdExportacion']);
          this.buscarExportaciones();
        } else {
          this.showAlert(response.Description);
        }
        // this.processingCreation = false;
        this.loading = false;
      }, 
      (errorService) => {             

        if(errorService.error.Description == undefined) {
          this.showAlert(errorService.error);  
        } else {
          this.showAlert(errorService.error.Description);
        }        
        // this.processingCreation = false;
        this.loading = false;
      });

  }

  removeDocument (index) { this.modelSeguimiento.Documentos.splice(index, 1); }

  onFileChanged(event) {    
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].type != "application/pdf") { continue; }
      if(this.modelSeguimiento.Documentos.filter(
        documento => documento.NombreDocumento.includes(event.target.files[i].name)).length > 0)
      {continue;}
      if (event.target.files[i].size > 2097152) { continue; }

      let newDocumento = new Documento();
      newDocumento.NombreDocumento = event.target.files[i].name;

      let reader = new FileReader();    
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        // console.log(reader.result);
        newDocumento.Archivo = reader.result.slice(28).toString();        
        this.modelSeguimiento.Documentos.push(newDocumento);
      };
      reader.onerror = (error) => {
        // console.log(error);        
      };                    
   }
  }

  private showAlert (msj:string) {
    this.snackBar.open(msj, "", {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  public openDocument (idDocumento) {   
    // console.log(idDocumento); 
    this.apiService.service_general_get(`/Exportacion/GetDocumentById/${idDocumento}`)
      .subscribe ( 
      (response:any) => {         
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          window.open("data:application/pdf;base64,"+encodeURI(response.Archivo), "_blank");
        } else if(/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)) {             
          var byteArray = new Uint8Array(this.base64ToArrayBuffer(response.Archivo));
          var blob = new Blob([byteArray], {
              type: 'application/pdf'
          });
          window.navigator.msSaveOrOpenBlob(blob, response.NombreDocumento);    
        } else {
          this.externalPdfViewer.pdfSrc = this.base64ToArrayBuffer(response.Archivo);      
          this.externalPdfViewer.refresh();              
        }
      }, 
      (errorService) => {         
        if(errorService.error == null) {
          this.showAlert("Ocurrió un error al obtener el documento.");  
        } else {
          this.showAlert(errorService.error); 
        }                        
      });     
  }

  private base64ToArrayBuffer(arreglito:string): Uint8Array {
    let binary_string =  window.atob(arreglito);
    let len = binary_string.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateExportacionesComponent, {
      // width: '80%',        
      disableClose: true,
      data: { }      
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');   
      // console.log(result);
      if (result === "true") {
        // console.log("resultado true");
        this.buscarExportaciones();
      }      
      // this.buscarPrevios();
    });
  } 

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Crear Exportaciones Stepper - Dialog Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialogs/dialog-create-exportaciones.component.html',
  providers: [FormBuilder, ApiServices]
})
export class DialogCreateExportacionesComponent implements OnInit {

  isLinear = true;  

  ///////////////////////
  // Catalogos para los <select>
  instruccionesManejoCatalogo = [];
  almacenOrigenCatalogo = [];
  rangoTemperaturaCatalogo = [];
  metodoPagoCatalogo = [];
  usoCFDICatalogo = [];
  condicionesAlmacenesCatalogo = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;  
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  minDate = new Date();    

  model:ExportacionNuevo = new ExportacionNuevo();  
  files;                    // Arreglo usado por el dragInputFiles  
  successResponse = false;
  processingCreation = false;
  responseMessage = "";

  dropInputChange(event) {
    // console.log(event);
    // console.log("drop change");
    this.onFileChanged(event);
  }
  
  constructor(
    public dialogRef: MatDialogRef<DialogCreateExportacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,
    private apiService:ApiServices,
    public snackBar: MatSnackBar) {

      this.apiService.service_general_get('/Catalogos/GetInstruccionesManejo')
      .subscribe ( 
      (response:any) => { this.instruccionesManejoCatalogo = response;}, 
      (errorService) => { });

      this.apiService.service_general_get('/Catalogos/GetCatalogoAlmacenOrigen')
      .subscribe ( 
      (response:any) => { this.almacenOrigenCatalogo = response;}, 
      (errorService) => { });      

      this.apiService.service_general_get('/Catalogos/GetConceptosCadenaFria')
      .subscribe ( 
      (response:any) => { this.rangoTemperaturaCatalogo = response;}, 
      (errorService) => { });     

      this.apiService.service_general_get('/Catalogos/GetConceptosMetodoPago')
      .subscribe ( 
      (response:any) => { this.metodoPagoCatalogo = response;}, 
      (errorService) => { });   
      
      this.apiService.service_general_get('/Catalogos/GetConceptosUsoCFDI')
      .subscribe ( 
      (response:any) => { this.usoCFDICatalogo = response; }, 
      (errorService) => { });     

      this.apiService.service_general_get('/Catalogos/GetCondicionesAlmacenaje')
      .subscribe ( 
      (response:any) => { this.condicionesAlmacenesCatalogo = response; }, 
      (errorService) => { });             
  }

  ngOnInit() {

    this.click();

    this.firstFormGroup = this._formBuilder.group({
      masterCtrl: ['', [Validators.required, Validators.pattern('([0-9]{3}-[0-9]{8})')]],
      houseCtrl: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]],      
    });
    this.secondFormGroup = this._formBuilder.group({
      pedimentoCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      piezasCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      pesoCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*[.]?[0-9]{1,2}')]],
      fechaEntradaMercanciaCtrl: [new Date(), Validators.required],
      comentarioCtrl: ['']    
    });
    
  }

  closeDialog(msj:string): void {    
    this.dialogRef.close(msj);
  }

  //////////////////////////////////
  // Forms Logic - Crear Pre Alerta         
  // Detonado cuando cambiamos de un paso con los botones (superiores) del stepper
  stepClick(event) {    
    // console.log(event);
    if (event.selectedIndex === 3){
      this.guardarFirstForm();
    }
  }  

  validarCampos(index) {   
    // console.log(index) ;
    if(!this.firstFormGroup.valid && index === 0) {  
      this.showAlert("Algunos campos necesitan ser revisados");    
    } 
    else if(!this.secondFormGroup.valid && index === 1) {  
      this.showAlert("Algunos campos necesitan ser revisados");    
    }       
  }

  private showAlert (msj:string) {
    this.snackBar.open(msj, "", {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  guardarFirstForm () {    
    if (this.model.Documentos.length < 1) { this.showAlert("Mínimo subir un documento"); return; }  // No olvidar en la vista
    if (this.model.Documentos.length > 6) { this.showAlert("Máximo subir 6 documentos"); return; }  // <mat-step [completed]="model.Documentos?.length >= 1 && this.model.Documentos.length <= 5" >
    
    this.model.Master = this.firstFormGroup.value.masterCtrl;
    this.model.House = this.firstFormGroup.value.houseCtrl;    
    this.model.Piezas = this.secondFormGroup.value.piezasCtrl;
    this.model.Peso = this.secondFormGroup.value.pesoCtrl;
    this.model.Pedimento = this.secondFormGroup.value.pedimentoCtrl;        
        
    let f = moment(this.secondFormGroup.value.fechaEntradaMercanciaCtrl).format('YYYYMMDD');        
    this.model.FechaEntradaMercancia = f;          

    if (this.secondFormGroup.value.comentarioCtrl == "") {            
      this.model.Seguimiento[0].Comentarios = "";
    } else {      
      this.model.Seguimiento[0].Comentarios = this.secondFormGroup.value.comentarioCtrl;;
    }

    // console.log(this.model);        
  }

  crearExportacion () {
    if (this.processingCreation) { return; }
    
    this.processingCreation = true;
    this.apiService.service_general_post(`/Exportacion/CrearAdelantoExportacion`, this.model)
      .subscribe ( 
      (response:any) => { 
        // console.log(response); 
        if (response.Result) {
          // this.dialogRef.close("true");
          this.successResponse = true;
          this.responseMessage = response.Description;          
        } else {
          this.showAlert(response.Description);
        }
        this.processingCreation = false;
      }, 
      (errorService) => {           

        if(errorService.error.Description == undefined) {
          this.showAlert(errorService.error);  
        } else {
          this.showAlert(errorService.error.Description);
        }        
        this.processingCreation = false;
      });
  }

  /////// Paso3 - Subir Archivos
  removeDocument (index) { 
    this.model.Documentos.splice(index, 1);     
  }

  onFileChanged(event) {    
    for (let i = 0; i < event.length; i++) {
      if (event[i].type != "application/pdf") { continue; }
      if(this.model.Documentos.filter(
        documento => documento.NombreDocumento.includes(event[i].name)).length > 0)
      {continue;}

      let newDocumento = new Documento();
      newDocumento.NombreDocumento = event[i].name;

      let reader = new FileReader();    
      reader.readAsDataURL(event[i]);
      reader.onload = () => {
        // console.log(reader.result);
        newDocumento.Archivo = reader.result.slice(28).toString();        
        this.model.Documentos.push(newDocumento);
      };
      reader.onerror = (error) => {
        // console.log(error);        
      };                    
   }
   this.files = [];
  }

  click(){
    let localSave = parseInt(localStorage.getItem("exportclick"));
    if(isNullOrUndefined(localSave) || isNaN(localSave)){
      localStorage.setItem("exportclick","1");
    } else {
      localSave++;
      localStorage.setItem("exportclick",localSave.toString());
      console.log(localSave);
    }
  }
}