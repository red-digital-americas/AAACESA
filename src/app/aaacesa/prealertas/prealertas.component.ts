import { Component, ViewEncapsulation, OnInit, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';

///////////
// API Services 
import { CatalogosService } from '../../services/catalogos.service';
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Prealertas
import { PrealertaBusqueda, PrealertaSeguimiento, Documento, PrealertaNuevo } from '../../models/prealertas.model';

@Component({
  selector: 'app-prealertas',
  templateUrl: './prealertas.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss',
    './prealertas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class PrealertasComponent {  
  
  ///////////////////////
  // Catalogos para los <select>
  instruccionesManejoCatalogo = [];  

  ///////////////////////
  // BusquedaSuperior  
  busquedaModel:PrealertaBusqueda = new PrealertaBusqueda();  
  fechaPrevioSearch:Date = null;
  rangoFechaSearch:any = [];
  instruccionesManejoSearch:any = "";  

  ///////////////////////
  // Status Filter Bar
  public statusEnum = ['Aceptada', 'Solicitada', 'Pendiente AAACESA', 'Pendiente Cliente', 'Rechazada', 'Finalizada', 'Cancelada'];
  public countStatus = {'Aceptada': 0, 'Solicitada': 0, 'PendienteAAACESA': 0, 'PendienteCliente': 0, 'Rechazada': 0, 'Finalizada': 0, 'Cancelada': 0}; 
  
  ///////////////////////
  // Mat Table  
  public data = [];                         // Data original consultada del servicio  
  public detailData = {};                   // Registro con el detalle obtenido
  dataSource = new MatTableDataSource();    // Data usada en la Mat Table

  displayedColumns: string[] = ['IdPrealerta', 'GuiaMaster', 'GuiaHouse', 'InstruccionesManejo', 'FechaArribo', 'Estatus', 'Acciones'];    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;     
    this.dataSource.sortingDataAccessor = (item, property) => {      
      switch (property) {     
        case 'FechaArribo': {              
          let f = item['FechaArribo'].split(' ')[0];                // 07/05/2019 12:00 PM          
          f = `${f.slice(3,5)}/${f.slice(0,2)}/${f.slice(6,10)}`;   // 05/07/2019
          //console.log(f);
          let newDate = new Date(f);
          console.log(newDate);
          return newDate;
        }
        default: { return item[property];} 
      }
    };
  }   

  ///////////////////////////////
  // Seguimiento
  modelSeguimiento:PrealertaSeguimiento = new PrealertaSeguimiento();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC SECTION    
  
  constructor(private http: Http, private apiService:ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar, private catalogosService:CatalogosService) {
    this.buscaPrealertasNueva();    
 
    this.apiService.service_general_get('/Catalogos/GetInstruccionesManejo')
      .subscribe ( 
      (response:any) => { this.instruccionesManejoCatalogo = response;}, 
      (errorService) => { console.log(errorService); });
  }

  //////////////////////////
  // Status Filter Bar Logic
  public updateCountStatus () {
    this.countStatus.Aceptada = this.data.filter(function (el) {return el.Estatus === 'Aceptada'; }).length;
    this.countStatus.Solicitada = this.data.filter(function (el) {return el.Estatus === 'Solicitada'; }).length;
    this.countStatus.PendienteAAACESA = this.data.filter(function (el) {return el.Estatus === 'Pendiente AAACESA'; }).length;
    this.countStatus.PendienteCliente = this.data.filter(function (el) {return el.Estatus === 'Pendiente Cliente'; }).length;
    this.countStatus.Rechazada = this.data.filter(function (el) {return el.Estatus === 'Rechazada'; }).length;
    this.countStatus.Finalizada = this.data.filter(function (el) {return el.Estatus === 'Finalizada'; }).length;
    this.countStatus.Cancelada = this.data.filter(function (el) {return el.Estatus === 'Cancelada'; }).length;
  }

  public applyFilter(index: number) {
    this.dataSource.data = [];

    if (index < this.statusEnum.length) {
      this.dataSource.data = this.data.filter (function (el) { return  el.Estatus === this.statusEnum[index]; }.bind(this));
    } else {
      this.dataSource.data = this.data;
    }
  }  
  
  public buscarPrealertas () {    
    // Estatus seleccionado "Niguno"
    if (typeof this.busquedaModel.ClaveInstruccionManejo === "undefined"){
      this.busquedaModel.ClaveInstruccionManejo = "";
    }
        
    // FechaPrevio
    if (this.fechaPrevioSearch != null){
      let f = this.fechaPrevioSearch.toISOString().slice(0,10); // 2019-11-23        
      f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;     // 20191123
      this.busquedaModel.FechaArribo = f; 
    } else {
      this.busquedaModel.FechaArribo = "";
    }

    // FechaInicial - FechaFinal
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        let f = this.rangoFechaSearch[0].toISOString().slice(0,10);   // 2019-11-23        
        f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;         // 20191123
        this.busquedaModel.FechaInicial = f;
        f = this.rangoFechaSearch[1].toISOString().slice(0,10);       // 2019-11-23        
        f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;         // 20191123
        this.busquedaModel.FechaFinal = f;            
      }    
    } else {    
      this.busquedaModel.FechaInicial = "";
      this.busquedaModel.FechaFinal = "";
    }    
    
    this.apiService.service_general_get_with_params('/Prealertas/Busqueda', this.busquedaModel)
      .subscribe ( 
      (response:any) => {                 
        this.data = response;        
        this.dataSource.data = this.data;
        this.updateCountStatus();
      }, 
      (errorService) => { console.log(errorService); });            
  }

  buscaPrealertasNueva () {
    this.busquedaModel.Clean();
    this.fechaPrevioSearch = null;
    this.rangoFechaSearch = [];
    this.buscarPrealertas();
  }

  public verDetalle (id: string) {    
    this.modelSeguimiento.cleanSeguimiento();      
    
    this.apiService.service_general_get(`/Prealertas/GetDetailsById/${id}`)
    .subscribe ( 
    (response:any) => { this.detailData = response;}, 
    (errorService) => { console.log(errorService); });
  } 
  
  ///////////////////////////////
  // Update Seguimiento
  public updateSeguimiento (estado:string) {
    this.modelSeguimiento.IdPrealertas = this.detailData['IdPrealerta'];
    this.modelSeguimiento.Estatus = estado;
    console.log(this.modelSeguimiento);  
    
    this.apiService.service_general_put(`/Prealertas/UpdateSeguimiento`, this.modelSeguimiento)
      .subscribe ( 
      (response:any) => { 
        console.log(response); 
        if (response.Result) {                 
          this.showAlert(response.Description);
          this.verDetalle(this.detailData['IdPrealerta']);
          this.buscarPrealertas();
        } else {
          this.showAlert(response.Description);
        }
        // this.processingCreation = false;
      }, 
      (errorService) => { 
        console.log(errorService);         

        if(errorService.error.Description == undefined) {
          this.showAlert(errorService.error);  
        } else {
          this.showAlert(errorService.error.Description);
        }        
        // this.processingCreation = false;
      });

  }

  removeDocument (index) { this.modelSeguimiento.Documentos.splice(index, 1); }

  onFileChanged(event) {    
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].type != "application/pdf") { continue; }
      if(this.modelSeguimiento.Documentos.filter(
        documento => documento.NombreDocumento.includes(event.target.files[i].name)).length > 0)
      {continue;}

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
        console.log(error);        
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
    console.log(idDocumento); 
    this.apiService.service_general_get(`/Prealertas/GetDocumentById/${idDocumento}`)
      .subscribe ( 
      (response:any) => {         
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Archivo}`);              
                
        // element.setAttribute('target','_blank');
        element.setAttribute('download', response.NombreDocumento);

        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        ////// Alternative
        // window.open("data:application/pdf,base64ssdfasdf;", "_blank";
      }, 
      (errorService) => { console.log(errorService); });     
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreatePrealertasComponent, {
      // width: '95%',        
      disableClose: true,
      data: { }      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');   
      console.log(result);
      if (result === "true") {
        // console.log("resultado true");
        this.buscarPrealertas();
      }      
      // this.buscarPrevios();
    });
  } 

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Crear Previo Stepper - Dialog Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialogs/dialog-create-prealertas.component.html',
  providers: [FormBuilder, ApiServices]
})
export class DialogCreatePrealertasComponent implements OnInit {

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

  model:PrealertaNuevo = new PrealertaNuevo();  
  files;                    // Arreglo usado por el dragInputFiles  
  successResponse = false;
  processingCreation = false;
  responseMessage = "";

  dropInputChange(event) {
    console.log(event);
    console.log("drop change");
    this.onFileChanged(event);
  }
  
  constructor(
    public dialogRef: MatDialogRef<DialogCreatePrealertasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,
    private apiService:ApiServices,
    public snackBar: MatSnackBar,
    private catalogosService:CatalogosService ) {

      this.apiService.service_general_get('/Catalogos/GetInstruccionesManejo')
      .subscribe ( 
      (response:any) => { this.instruccionesManejoCatalogo = response;}, 
      (errorService) => { console.log(errorService); });

      this.apiService.service_general_get('/Catalogos/GetCatalogoAlmacenOrigen')
      .subscribe ( 
      (response:any) => { this.almacenOrigenCatalogo = response;}, 
      (errorService) => { console.log(errorService); });      

      this.apiService.service_general_get('/Catalogos/GetConceptosCadenaFria')
      .subscribe ( 
      (response:any) => { this.rangoTemperaturaCatalogo = response;}, 
      (errorService) => { console.log(errorService); });     

      this.apiService.service_general_get('/Catalogos/GetConceptosMetodoPago')
      .subscribe ( 
      (response:any) => { this.metodoPagoCatalogo = response;}, 
      (errorService) => { console.log(errorService); });   
      
      this.apiService.service_general_get('/Catalogos/GetConceptosUsoCFDI')
      .subscribe ( 
      (response:any) => { this.usoCFDICatalogo = response; }, 
      (errorService) => { console.log(errorService); });     

      this.apiService.service_general_get('/Catalogos/GetCondicionesAlmacenaje')
      .subscribe ( 
      (response:any) => { this.condicionesAlmacenesCatalogo = response; }, 
      (errorService) => { console.log(errorService); });             
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      masterCtrl: ['', [Validators.required, Validators.pattern('([0-9]{3}-[0-9]{8})')]],
      houseCtrl: ['', Validators.required],
      referenciaCtrl: ['', []]
    });
    this.secondFormGroup = this._formBuilder.group({
      referenciaCtrl: ['', Validators.required],
      piezasCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      pesoCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      fechaArriboCtrl: ['', Validators.required],
      almacenOrigenCtrl: ['', Validators.required],
      almacenOrigenSearchCtrl: ['', []],      
      rangoTemperaturaCtrl: ['', Validators.required],
      rangoTemperaturaSearchCtrl: ['', []],
      metodoPagoCtrl: ['', Validators.required],
      metodoPagoSearchCtrl: ['', []],
      usoCFDICtrl: ['', Validators.required],
      usoCFDISearchCtrl: ['', []],
      condicionesAlmacenesCtrl: ['', Validators.required],
      condicionesAlmacenesSearchCtrl: ['', []],
      instruccionesManejoCtrl: ['', [Validators.required]],
      consignatarioCtrl: ['', Validators.required],
      consolidadoCtrl: [false, Validators.required],      
      comentarioCtrl: [''],    
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
    console.log(index) ;
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
    if (this.model.Documentos.length < 1) { this.showAlert("Mínimo subir un documento"); return; }
    
    this.model.GuiaMaster = this.firstFormGroup.value.masterCtrl;
    this.model.GuiaHouse = this.firstFormGroup.value.houseCtrl;
    this.model.AlmacenOrigen = this.secondFormGroup.value.almacenOrigenCtrl;
    this.model.CondicionAlmacenaje = this.secondFormGroup.value.condicionesAlmacenesCtrl;
    this.model.Consignatario = this.secondFormGroup.value.consignatarioCtrl;
    this.model.InstruccionesManejo = this.secondFormGroup.value.instruccionesManejoCtrl;     
    this.model.Piezas = this.secondFormGroup.value.piezasCtrl;
    this.model.Peso = this.secondFormGroup.value.pesoCtrl;
    this.model.RangoTemperatura = this.secondFormGroup.value.rangoTemperaturaCtrl;
    this.model.Referencia = this.secondFormGroup.value.referenciaCtrl;
    this.model.Consolidado = this.secondFormGroup.value.consolidadoCtrl;
    this.model.MetodoPago = this.secondFormGroup.value.metodoPagoCtrl;
    this.model.UsoCFDI = this.secondFormGroup.value.usoCFDICtrl;
    
    let f = this.secondFormGroup.value.fechaArriboCtrl.toISOString();       // 2019-11-23        
    // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)} 12:20`; 
    f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;
    
    this.model.FechaArribo = f;    
    
    if (this.secondFormGroup.value.comentarioCtrl == "") {            
      this.model.Seguimiento[0].Comentarios = "";
    } else {      
      this.model.Seguimiento[0].Comentarios = this.secondFormGroup.value.comentarioCtrl;;
    }

    console.log(this.model);    
    // console.log(this.model.FechaPrevio);    
  }

  crearPrevio () {
    if (this.processingCreation) { return; }
    
    this.processingCreation = true;
    this.apiService.service_general_post(`/AdelantoPrevios/CrearAdelantoPrevios`, this.model)
      .subscribe ( 
      (response:any) => { 
        console.log(response); 
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
        console.log(errorService);         

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
        console.log(error);        
      };                    
   }
   this.files = [];
  }
}