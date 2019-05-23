import { Component, ViewEncapsulation, ViewChild, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { BsLocaleService } from 'ngx-bootstrap';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatStepper } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Prealertas
import { SalidaBusqueda, SalidaSeguimiento, Documento, SalidaNuevo } from '../../models/salidas.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { isNullOrUndefined } from 'util';

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
  // Status Filter Bar  
  public statusEnum = ['Solicitada', 'Rechazada', 'Pendiente Cliente', 'Pendiente AAACESA', 'Aceptada', 'Finalizada', 'Cancelada'];  
  public statusLabels = ['Solicitada', 'Rechazada', 'P.Cliente', 'P.AAACESA', 'Aceptada', 'Finalizada', 'Cancelada'];  
  public countStatus = [0, 0, 0, 0, 0, 0, 0];
  public currentFilterIndex = this.statusEnum.length;
  
  ///////////////////////
  // Mat Table  
  public data = [];                         // Data original consultada del servicio  
  public detailData = {};                   // Registro con el detalle obtenido
  dataSource = new MatTableDataSource();    // Data usada en la Mat Table

  displayedColumns: string[] = ['IdAdelantoSalidas', 'FechaCreacion', 'Master', 'House', 'Pedimento', 'RFCFacturar', 'FechaSalida', 'Estatus', 'Acciones'];    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Registros por página";
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
  @ViewChild('externalPdfViewer') public externalPdfViewer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC SECTION    
  
  constructor( private apiService:ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar, private localeService: BsLocaleService) {
    this.localeService.use('es');
    this.buscaSalidasNueva();    
 
    this.apiService.service_general_get('/Catalogos/GetCatalogoEstatus')
      .subscribe ( 
      (response:any) => { this.estatusCatalogo = response;}, 
      (errorService) => { });
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
        this.updateCountStatus();     
        this.currentFilterIndex = this.statusEnum.length;
        this.loading = false;
      }, 
      (errorService) => { this.loading = false;});            
  }

  buscaSalidasNueva () {
    this.busquedaModel.Clean();
    this.fechaPrevioSearch = null;
    this.rangoFechaSearch = "";
    this.buscarSalidas();
  }

  public verDetalle (id: string) {    
    this.loading = true;
    this.detailData = {};
    this.modelSeguimiento.cleanSeguimiento();      
    
    this.apiService.service_general_get(`/AdelantoFacturacion/GetDetailsById/${id}`)
    .subscribe ( 
    (response:any) => { this.detailData = response; this.loading = false;}, 
    (errorService) => { this.loading = false; });    
  } 
  
  ///////////////////////////////
  // Update Seguimiento
  public updateSeguimiento (estado:string) {
    if (estado==="Cancelada" && this.modelSeguimiento.Documentos.length > 0) { 
      this.showAlert("No se pueden enviar documentos al cancelar"); return;
    }

    this.loading = true;
    this.modelSeguimiento.IdAdelantoSalidas = this.detailData['IdAdelantoSalidas'];
    this.modelSeguimiento.Estatus = estado;
    // console.log(this.modelSeguimiento);  
    
    this.apiService.service_general_put(`/AdelantoFacturacion/UpdateSeguimiento`, this.modelSeguimiento)
      .subscribe ( 
      (response:any) => { 
        // console.log(response); 
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
        // console.log(errorService);         

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
    this.apiService.service_general_get(`/AdelantoFacturacion/GetDocumentById/${idDocumento}`)
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
    const dialogRef = this.dialog.open(DialogCreateSalidaComponent, {
      // width: '95%',        
      disableClose: true,
      data: { }      
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');   
      // console.log(result);
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

  @ViewChild('stepper') stepper: MatStepper;
  firstFormGroup: FormGroup;
  isMasterHouseValid = false;
  secondFormGroup: FormGroup;
  isSecondFormValid = false;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  minDate = this.minDate = moment(new Date()).add(1, 'days').toDate();

  model:SalidaNuevo = new SalidaNuevo();  
  files;                                  // Arreglo usado por el dragInputFiles  
  referencia = "Sin referencia";          // Referencia que se utiliza para llenar Master/House
  successResponse = false;
  processingCreation = false;
  responseMessage = "";

  dropInputChange(event) {
    // console.log(event);
    // console.log("drop change");
    this.onFileChanged(event);
  }
  
constructor(
  public dialogRef: MatDialogRef<DialogCreateSalidaComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,
  private apiService:ApiServices,
  public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.click();

    this.firstFormGroup = this._formBuilder.group({
      masterCtrl: ['', [Validators.required, Validators.pattern('([0-9]{3}-[0-9]{8})')]],
      houseCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      referenciaCtrl: ['', []]
    });
    this.secondFormGroup = this._formBuilder.group({
      rfcFacturarCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      pedimentoCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      subdivisionCtrl: [false, Validators.required],      
      patenteCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      fechaSalidaCtrl: [moment(new Date()).add(1, 'days').toDate(), Validators.required],
      horaSalidaCtrl: [parseInt(moment(new Date()).format('HH')), [Validators.required, Validators.min(0), Validators.max(23), this.hourValidation.bind(this)]],
      minutoSalidaCtrl: [parseInt(moment(new Date()).format('mm')), [Validators.required, Validators.min(0), Validators.max(59), this.minuteValidation.bind(this)]],            
      comentarioCtrl: [''],    
    }); 

    this.fechaArriboChange(); this.hourChange(); this.minuteChange();
  }

  hourValidation (control: FormControl): {[s:string]:boolean} {
    if (!this.hasOwnProperty('secondFormGroup')) { return {hour:true} }

    let currentHour = parseInt(moment(new Date()).format('HH'));    
    let selectedHour = parseInt(control.value);

    let selectedDate = moment(this.secondFormGroup.controls.fechaSalidaCtrl.value).format('DD/MM/YYYY');
    let today = moment(new Date()).format('DD/MM/YYYY');                 

    if (selectedHour < currentHour && (today === selectedDate)) { return { hour:true } } // fallando          
    return null; // validacion pasa
  }

  minuteValidation (control: FormControl): {[s:string]:boolean} {
    if (!this.hasOwnProperty('secondFormGroup')) { return {minute:true} }

    let currentMinute = parseInt(moment(new Date()).format('mm'));    
    let selectedMinute = parseInt(control.value);
    let currentHour = parseInt(moment(new Date()).format('HH'));    
    let selectedHour = this.secondFormGroup.controls.horaSalidaCtrl.value;  
        
    let selectedDate = moment(this.secondFormGroup.controls.fechaSalidaCtrl.value).format('DD/MM/YYYY');
    let today = moment(new Date()).format('DD/MM/YYYY');                      
        
    if ( (selectedMinute < currentMinute) && (selectedHour <= currentHour) && (today === selectedDate) ) { return { minute:true } } // fallando          
    return null; // validacion pasa
  }

  fechaArriboChange() {    
    this.secondFormGroup.get('fechaSalidaCtrl').valueChanges    
    .subscribe((data) => { 
      this.secondFormGroup.get('horaSalidaCtrl').updateValueAndValidity();  
      this.secondFormGroup.get('minutoSalidaCtrl').updateValueAndValidity();            
    });
  }  
  hourChange() {
    this.secondFormGroup.get('horaSalidaCtrl').valueChanges    
    .subscribe((data) => {       
      this.secondFormGroup.get('minutoSalidaCtrl').updateValueAndValidity({onlySelf: true, emitEvent: false});
    });
  }
  minuteChange() {
    this.secondFormGroup.get('minutoSalidaCtrl').valueChanges    
    .subscribe((data) => {       
      this.secondFormGroup.get('horaSalidaCtrl').updateValueAndValidity({onlySelf: true, emitEvent: false});
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

    if (event.selectedIndex === 0){
      this.isMasterHouseValid = false;
    }

    if (event.selectedIndex === 1) {
      this.isSecondFormValid = false;
    }

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
    
    if (this.firstFormGroup.valid && index === 0) {
      this.validarMasterHouse();      
    }

    if (this.secondFormGroup.valid && index === 1) {
      this.validarRFCPatente();
    }

  }

  private validarMasterHouse() {
    this.processingCreation = true;
    this.isMasterHouseValid = false;
    
    this.apiService.service_general_get(`/ConsultaMercancia/CheckAWB?Master=${this.firstFormGroup.get('masterCtrl').value}&House=${this.firstFormGroup.get('houseCtrl').value}`)    
    .subscribe ( 
    (response:any) => {       
      // this.secondFormGroup.get('piezasCtrl').setValue(response.Piezas);
      // this.secondFormGroup.get('pesoCtrl').setValue(response.Peso);            
      this.showAlert("Master/House encontrada");      
      this.isMasterHouseValid = true;
      this.processingCreation = false;
      setTimeout(() => {this.stepper.selectedIndex = 1;});      // For Linear Steppers need this trick
    }, 
    (errorService) => {       
      // this.secondFormGroup.value.piezasCtrl = "";                  
      // this.secondFormGroup.value.pesoCtrl = "";
      this.showAlert(errorService.error);      
      this.processingCreation = false; 
    });        
  }

  private validarRFCPatente() {
    this.processingCreation = true;
    this.isSecondFormValid = false;
        
    this.apiService.service_general_get(`/AdelantoFacturacion/ValidaRFCFactura/${this.secondFormGroup.get('rfcFacturarCtrl').value}`)        
    .subscribe ( 
    (response:any) => {             
      // this.showAlert("RFC Valido");      
      this.checkPatente();
    }, 
    (errorService) => {             
      // this.showAlert("RFC No Valido");            
      this.showAlert(errorService.error);      
      this.processingCreation = false; 
    });        
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
    let referencia = this.firstFormGroup.get('referenciaCtrl').value;           
    this.apiService.service_general_get(`/ConsultaMercancia/GetAWBByReference/${referencia}`)
    .subscribe ( 
    (response:any) => { 
      // console.log(response);
      this.firstFormGroup.get('masterCtrl').setValue(response.Master);
      this.firstFormGroup.get('houseCtrl').setValue(response.House);
      this.referencia = this.firstFormGroup.get('referenciaCtrl').value;
    },(errorService) => { 
      // console.log(errorService);
      this.firstFormGroup.get('masterCtrl').setValue('');
      this.firstFormGroup.get('houseCtrl').setValue('');
      this.referencia = "Sin Referencia";
      this.showAlert("Referencia no encontrada");
    });
  }
  
  cleanReferencia() {        
    this.firstFormGroup.get('referenciaCtrl').setValue('');  

    this.firstFormGroup.get('referenciaCtrl').enable({onlySelf: true, emitEvent: false});
    if (this.firstFormGroup.get('masterCtrl').value.length > 0 || this.firstFormGroup.get('houseCtrl').value.length > 0) {
      this.firstFormGroup.get('referenciaCtrl').disable({onlySelf: true, emitEvent: false});
    }

    this.referencia = "Sin Referencia";        
  }
  cleanMasterHouse() {        
    this.firstFormGroup.get('masterCtrl').setValue('');  
    this.firstFormGroup.get('houseCtrl').setValue('');  

    this.firstFormGroup.get('masterCtrl').enable({onlySelf: true, emitEvent: false});
    this.firstFormGroup.get('houseCtrl').enable({onlySelf: true, emitEvent: false});
    if (this.firstFormGroup.get('referenciaCtrl').value.length > 0) {
      this.firstFormGroup.get('masterCtrl').disable({onlySelf: true, emitEvent: false});
      this.firstFormGroup.get('houseCtrl').disable({onlySelf: true, emitEvent: false});
    }

    this.referencia = "Sin Referencia";        
  }

  ////////////////////
  // Paso 2
  private checkPatente () {
    this.apiService.service_general_get(`/AdelantoFacturacion/ValidaPatenteTerceros/${this.secondFormGroup.get('patenteCtrl').value}`)        
    .subscribe ( 
    (response:any) => {             
      // this.showAlert("PATENTE Valido");      
      this.isSecondFormValid = true;
      this.processingCreation = false;
      setTimeout(() => {this.stepper.selectedIndex = 2;});      // For Linear Steppers need this trick
    }, 
    (errorService) => {             
      // this.showAlert("PATENTE No Valido");      
      this.showAlert(errorService.error.Description);      
      this.processingCreation = false; 
    });  
  }

  guardarFirstForm () {    
    if (this.model.Documentos.length < 1) { this.showAlert("Mínimo subir un documento"); return; }  // No olvidar en la vista
    if (this.model.Documentos.length > 5) { this.showAlert("Máximo subir 5 documentos"); return; }  // <mat-step [completed]="model.Documentos?.length >= 1 && this.model.Documentos.length <= 5" >
    
    this.model.Master = this.firstFormGroup.get('masterCtrl').value;
    this.model.House = this.firstFormGroup.get('houseCtrl').value;
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

    // console.log(this.model);    
    // console.log(this.model.FechaPrevio);    
  }

  crearSalida () {
    if (this.processingCreation) { return; }
    
    this.processingCreation = true;
    this.apiService.service_general_post(`/AdelantoFacturacion/CrearAdelantoSalidas`, this.model)
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
    let localSave = parseInt(localStorage.getItem("salidasclick"));
    if(isNullOrUndefined(localSave) || isNaN(localSave)){
      localStorage.setItem("salidasclick", "1");
    } else {
      localSave++;
      localStorage.setItem("salidasclick",localSave.toString());
      console.log(localSave);
    }
  }

}
