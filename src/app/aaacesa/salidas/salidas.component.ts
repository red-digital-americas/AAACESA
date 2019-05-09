import { Component, ViewEncapsulation, ViewChild, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Prealertas
import { SalidaBusqueda, SalidaSeguimiento, Documento, SalidaNuevo } from '../../models/salidas.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss',
    './salidas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class SalidasComponent  {
  loading = false;  
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  ///////////////////////
  // Catalogos para los <select>
  estatusCatalogo = [];

  ///////////////////////
  // BusquedaSuperior  
  busquedaModel:SalidaBusqueda = new SalidaBusqueda();  
  fechaPrevioSearch:Date = null;
  rangoFechaSearch:any = [];
  estatusSearch:any = "";    
  
  ///////////////////////
  // Mat Table  
  public data = [];                         // Data original consultada del servicio  
  public detailData = {};                   // Registro con el detalle obtenido
  dataSource = new MatTableDataSource();    // Data usada en la Mat Table

  displayedColumns: string[] = ['IdAdelantoSalidas', 'Master', 'House', 'Pedimento', 'RFCFacturar', 'FechaCreacion', 'Estatus', 'Acciones'];    
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
          // console.log(newDate);
          return newDate;
        }
        default: { return item[property];} 
      }
    };
  }   

  ///////////////////////////////
  // Seguimiento
  modelSeguimiento:SalidaSeguimiento = new SalidaSeguimiento();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC SECTION    
  
  constructor( private apiService:ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.buscaSalidasNueva();    
 
    this.apiService.service_general_get('/Catalogos/GetCatalogoEstatus')
      .subscribe ( 
      (response:any) => { this.estatusCatalogo = response;}, 
      (errorService) => { console.log(errorService); });
  }
  
  public buscarSalidas () {    
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
    this.apiService.service_general_get_with_params('/AdelantoFacturacion/Busqueda', this.busquedaModel)
      .subscribe ( 
      (response:any) => {                 
        this.data = response;        
        this.dataSource.data = this.data;        
        this.loading = false;
      }, 
      (errorService) => { console.log(errorService); this.loading = false;});            
  }

  buscaSalidasNueva () {
    this.busquedaModel.Clean();
    this.fechaPrevioSearch = null;
    this.rangoFechaSearch = [];
    this.buscarSalidas();
  }

  public verDetalle (id: string) {    
    this.loading = true;
    this.detailData = {};
    this.modelSeguimiento.cleanSeguimiento();      
    
    this.apiService.service_general_get(`/AdelantoFacturacion/GetDetailsById/${id}`)
    .subscribe ( 
    (response:any) => { this.detailData = response; this.loading = false;}, 
    (errorService) => { console.log(errorService); this.loading = false; });
  } 
  
  ///////////////////////////////
  // Update Seguimiento
  public updateSeguimiento (estado:string) {
    this.loading = true;
    this.modelSeguimiento.IdAdelantoSalidas = this.detailData['IdAdelantoSalidas'];
    this.modelSeguimiento.Estatus = estado;
    console.log(this.modelSeguimiento);  
    
    this.apiService.service_general_put(`/AdelantoFacturacion/UpdateSeguimiento`, this.modelSeguimiento)
      .subscribe ( 
      (response:any) => { 
        console.log(response); 
        if (response.Result) {                 
          this.showAlert(response.Description);
          this.verDetalle(this.detailData['IdAdelantoSalidas']);
          this.buscarSalidas();
        } else {
          this.showAlert(response.Description);
        }
        // this.processingCreation = false;
        this.loading = false;
      }, 
      (errorService) => { 
        console.log(errorService);         

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
    // console.log(idDocumento); 
    this.apiService.service_general_get(`/AdelantoFacturacion/GetDocumentById/${idDocumento}`)
      .subscribe ( 
      (response:any) => {         

        /////// Option 1 - Creating a new anchor <a> tag
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Archivo}`);                                      
        element.setAttribute('download', response.NombreDocumento);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);              
        
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+encodeURI(response.Archivo), "_blank");
        }        

      }, 
      (errorService) => { console.log(errorService); });     
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateSalidaComponent, {
      // width: '95%',        
      disableClose: true,
      data: { }      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');   
      console.log(result);
      if (result === "true") {
        // console.log("resultado true");
        this.buscarSalidas();
      }      
      // this.buscarPrevios();
    });
  } 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Crear Salidas Stepper - Dialog Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialogs/dialog-create-salida.component.html',
  providers: [FormBuilder, ApiServices]
})
export class DialogCreateSalidaComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  model:SalidaNuevo = new SalidaNuevo();  
  files;                                  // Arreglo usado por el dragInputFiles  
  referencia = "Sin referencia";          // Referencia que se utiliza para llenar Master/House
  successResponse = false;
  processingCreation = false;
  responseMessage = "";

  dropInputChange(event) {
    console.log(event);
    console.log("drop change");
    this.onFileChanged(event);
  }
  
constructor(
  public dialogRef: MatDialogRef<DialogCreateSalidaComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,
  private apiService:ApiServices,
  public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      masterCtrl: ['', [Validators.required, Validators.pattern('([0-9]{3}-[0-9]{8})')]],
      houseCtrl: ['', Validators.required],
      referenciaCtrl: ['', []]
    });
    this.secondFormGroup = this._formBuilder.group({
      rfcFacturarCtrl: ['', Validators.required],
      pedimentoCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      subdivisionCtrl: [false, Validators.required],      
      patenteCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      fechaSalidaCtrl: ['', Validators.required],
      horaSalidaCtrl: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      minutoSalidaCtrl: ['', [Validators.required, Validators.min(0), Validators.max(59)]],            
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
    // console.log(index);
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

  //////////////////////
  // Paso 1
  checkReferencia() {    
    //Consultar servicios        
    if (this.firstFormGroup.get('referenciaCtrl').value == "123abcd") {
      this.firstFormGroup.get('masterCtrl').setValue('123-12345678');
      this.firstFormGroup.get('houseCtrl').setValue('houseReferencia');
      this.referencia = this.firstFormGroup.get('referenciaCtrl').value;
    } else {
      this.firstFormGroup.get('masterCtrl').setValue('');
      this.firstFormGroup.get('houseCtrl').setValue('');
      this.referencia = "Sin Referencia";
    }
  }

  cleanReferencia() {        
    this.firstFormGroup.get('referenciaCtrl').setValue('');          
    this.referencia = "Sin Referencia";
  }

  guardarFirstForm () {    
    if (this.model.Documentos.length < 1) { this.showAlert("Mínimo subir un documento"); return; }
    
    this.model.Master = this.firstFormGroup.value.masterCtrl;      
    this.model.House = this.firstFormGroup.value.houseCtrl;
    this.model.RFCFacturar = this.secondFormGroup.value.rfcFacturarCtrl;      
    this.model.Pedimento = this.secondFormGroup.value.pedimentoCtrl;  
    this.model.Subdivision = this.secondFormGroup.value.subdivisionCtrl;               
    this.model.Patente = this.secondFormGroup.value.patenteCtrl;        

    let f = moment(this.secondFormGroup.value.fechaSalidaCtrl).format('YYYYMMDD');    

    if (this.secondFormGroup.value.horaSalidaCtrl < 10){
      f = `${f} 0${this.secondFormGroup.value.horaSalidaCtrl}`;
    } else {
      f = `${f} ${this.secondFormGroup.value.horaSalidaCtrl}`;
    }

    if (this.secondFormGroup.value.minutoSalidaCtrl < 10) {
      f = `${f}:0${this.secondFormGroup.value.minutoSalidaCtrl}`;
    } else {
      f = `${f}:${this.secondFormGroup.value.minutoSalidaCtrl}`;
    }

    this.model.FechaSalida = f;    
    
    if (this.secondFormGroup.value.comentarioCtrl == "") {            
      this.model.Seguimiento[0].Comentarios = "";
    } else {      
      this.model.Seguimiento[0].Comentarios = this.secondFormGroup.value.comentarioCtrl;;
    }

    console.log(this.model);    
    // console.log(this.model.FechaPrevio);    
  }

  crearSalida () {
    if (this.processingCreation) { return; }
    
    this.processingCreation = true;
    this.apiService.service_general_post(`/AdelantoFacturacion/CrearAdelantoSalidas`, this.model)
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
