import { Component, ViewEncapsulation, OnInit, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ngfModule, ngf } from "angular-file" // DragInput
import { BsLocaleService } from 'ngx-bootstrap';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatStepper } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Previos
import { PrevioNuevo, PrevioBusqueda, Documento, Seguimiento, PrevioSeguimiento } from '../../models/previos.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { isNullOrUndefined } from 'util';


@Component({
  templateUrl: './previos.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
  './previos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class PreviosComponent  {

  loading = false;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  
  ///////////////////////
  // Catalogos para los <select>
  estatusCatalogo = [];

  ///////////////////////
  // BusquedaSuperior
  showAdvanceSearch = true; // Don't Change
  busquedaModel:PrevioBusqueda = new PrevioBusqueda();  
  fechaPrevioSearch:Date = null;
  estatusSearch:any = "";  
  rangoFechaSearch:any = [];
  
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

  displayedColumns: string[] = ['IdAdelantoPrevios', 'FechaSolicitud', 'Master', 'House', 'Nombre', 'Patente', 'FechaPrevio', 'Estatus', 'Acciones'];    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {

    this.click();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;     
    this.dataSource.sortingDataAccessor = (item, property) => {      
      switch (property) {     
        case 'FechaPrevio': {              
          let f = item['FechaPrevio'].split(' ')[0];                // 07/05/2019 12:00 PM          
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
  modelSeguimiento:PrevioSeguimiento = new PrevioSeguimiento();
  @ViewChild('externalPdfViewer') public externalPdfViewer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC SECTION    

  constructor(private http: Http, private apiService:ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar, private localeService: BsLocaleService) {            
    this.localeService.use('es');
    this.buscarPrevios();

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

  public buscarPrevios () { 
    this.loading = true;
    
    // Estatus seleccionado "Niguno"
    if (typeof this.busquedaModel.Estatus === "undefined"){
      this.busquedaModel.Estatus = "";
    }
        
    // FechaPrevio
    if (this.fechaPrevioSearch != null){
      // let f = this.fechaPrevioSearch.toISOString().slice(0,10); // 2019-11-23        
      // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;     // 20191123
      // this.busquedaModel.FechaPrevio = f; 
      this.busquedaModel.FechaPrevio = moment(this.fechaPrevioSearch).format('YYYYMMDD');
    } else {
      this.busquedaModel.FechaPrevio = "";
    }

    // FechaInicial - FechaFinal
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        // let f = this.rangoFechaSearch[0].toISOString().slice(0,10);   // 2019-11-23        
        // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;         // 20191123
        // this.busquedaModel.FechaInicial = f;
        // f = this.rangoFechaSearch[1].toISOString().slice(0,10);       // 2019-11-23        
        // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;         // 20191123
        // this.busquedaModel.FechaFinal = f;            

        this.busquedaModel.FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaModel.FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {    
      this.busquedaModel.FechaInicial = "";
      this.busquedaModel.FechaFinal = "";
    }    

    this.apiService.service_general_get_with_params('/AdelantoPrevios/Busqueda', this.busquedaModel)
      .subscribe ( 
      (response:any) => {                 
        this.data = response;        
        this.dataSource.data = this.data;
        this.updateCountStatus();
        this.currentFilterIndex = this.statusEnum.length;
        this.loading = false;
      }, 
      (errorService) => { this.loading = false; });   
  }

  buscaPreviosNueva () {
    this.busquedaModel.Clean();
    this.fechaPrevioSearch = null;
    this.rangoFechaSearch = "";
    this.buscarPrevios();
  }

  public verDetalle (id: string) {    
    this.loading = true;
    this.modelSeguimiento.cleanSeguimiento();
    this.detailData = {};
      
    this.apiService.service_general_get(`/AdelantoPrevios/GetDetailsById/${id}`)
    .subscribe ( 
    (response:any) => { this.detailData = response; this.loading = false;}, 
    (errorService) => { this.loading = false;});
  }


  ///////////////////////////////
  // Update Seguimiento
  public updateSeguimiento (estado:string) {
    if (estado==="Cancelada" && this.modelSeguimiento.Documentos.length > 0) { 
      this.showAlert("No se pueden enviar documentos al cancelar"); return;
    }

    this.loading = true;
    this.modelSeguimiento.IdAdelantoPrevios = this.detailData['IdAdelantoPrevios'];
    this.modelSeguimiento.Estatus = estado;
    // console.log(this.modelSeguimiento);  
    
    this.apiService.service_general_put(`/AdelantoPrevios/UpdateSeguimiento`, this.modelSeguimiento)
      .subscribe ( 
      (response:any) => { 
        // console.log(response); 
        if (response.Result) {          
          // this.successResponse = true;
          // this.responseMessage = response.Description;          
          this.showAlert(response.Description);

          this.verDetalle(this.detailData['IdAdelantoPrevios']);
          this.buscarPrevios();
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
    this.apiService.service_general_get(`/AdelantoPrevios/GetDocumentById/${idDocumento}`)
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
    const dialogRef = this.dialog.open(DialogCreatePreviosComponent, {
      width: '70%',        
      disableClose: true,
      data: { }      
    });



    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');   
      // console.log(result);
      if (result === "true") {
        // console.log("resultado true");
        this.buscarPrevios();
      }      
      // this.buscarPrevios();
    });
  } 

  click(){
    let localSave = parseInt(localStorage.getItem("prevclick"));
    if(isNullOrUndefined(localSave) || isNaN(localSave)){
      localStorage.setItem("prevclick", "1");
    } else {
      localSave++;
      localStorage.setItem("prevclick",localSave.toString());
      console.log(localSave);
    }
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Crear Previo Stepper - Dialog Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialogs/dialog-create-previos.component.html',
  providers: [FormBuilder, ApiServices]
})
export class DialogCreatePreviosComponent implements OnInit {

  isLinear = true;

  @ViewChild('stepper') stepper: MatStepper;
  firstFormGroup: FormGroup;
  isMasterHouseValid = false;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isThirdFormValid = false;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  minDate = new Date();
    
  daterangepickerOptions = {
    startDate: '09/01/2017',
    endDate: '09/02/2017',
    format: 'DD/MM/YYYY',
    singleDatePicker: true,
    showDropdowns: true,
    timePicker: true
  }

  model:PrevioNuevo = new PrevioNuevo();  
  files;                                   // Arreglo usado por el dragInputFiles
  referencia = "Sin Referencia";          // Referencia que se utiliza para llenar Master/House
  successResponse = false;
  processingCreation = false;
  responseMessage = "";

  dropInputChange(event) {
    // console.log(event);
    // console.log("drop change");
    this.onFileChanged(event);
  }
  
  constructor(
    public dialogRef: MatDialogRef<DialogCreatePreviosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder,
    private apiService:ApiServices,
    public snackBar: MatSnackBar ) { }

  ngOnInit() {

    
    
    this.firstFormGroup = this._formBuilder.group({
      masterCtrl: ['', [Validators.required, Validators.pattern('([0-9]{3}-[0-9]{8})')]],
      houseCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      referenciaCtrl: ['', []]
    });
    this.secondFormGroup = this._formBuilder.group({  
      fechaPrevioCtrl: [new Date(), Validators.required],
      horaPrevioCtrl: [parseInt(moment(new Date()).format('HH')), [Validators.required, Validators.min(0), Validators.max(23), this.hourValidation.bind(this)]],
      minutoPrevioCtrl: [parseInt(moment(new Date()).format('mm')), [Validators.required, Validators.min(0), Validators.max(59), this.minuteValidation.bind(this)]],      
      piezasCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      pesoCtrl: ['', [Validators.required, Validators.pattern('^[0-9]*[.]?[0-9]{1,2}')]],
      etiquetadoCtrl: [false, Validators.required],      
    });

    this.thirdFormGroup = this._formBuilder.group({
      numGafeteCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],      
      nombreCtrl: ['', Validators.required],
      paternoCtrl: ['', Validators.required],
      maternoCtrl: ['', Validators.required],
      patenteCtrl: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],            
      comentarioCtrl: [''],     
    });
    
    this.fechaArriboChange(); this.hourChange(); this.minuteChange();
  }

  hourValidation (control: FormControl): {[s:string]:boolean} {
    if (!this.hasOwnProperty('secondFormGroup')) { return {hour:true} }

    let currentHour = parseInt(moment(new Date()).format('HH'));    
    let selectedHour = parseInt(control.value);        

    let selectedDate = moment(this.secondFormGroup.controls.fechaPrevioCtrl.value).format('DD/MM/YYYY');
    let today = moment(new Date()).format('DD/MM/YYYY');                 

    if (selectedHour < currentHour && (today === selectedDate)) { return { hour:true } } // fallando          
    return null; // validacion pasa
  }

  minuteValidation (control: FormControl): {[s:string]:boolean} {
    if (!this.hasOwnProperty('secondFormGroup')) { return {minute:true} }

    let currentMinute = parseInt(moment(new Date()).format('mm'));    
    let selectedMinute = parseInt(control.value);
    let currentHour = parseInt(moment(new Date()).format('HH'));    
    let selectedHour = this.secondFormGroup.controls.horaPrevioCtrl.value;  
        
    let selectedDate = moment(this.secondFormGroup.controls.fechaPrevioCtrl.value).format('DD/MM/YYYY');
    let today = moment(new Date()).format('DD/MM/YYYY');                      
        
    if ( (selectedMinute < currentMinute) && (selectedHour <= currentHour) && (today === selectedDate) ) { return { minute:true } } // fallando          
    return null; // validacion pasa
  }

  fechaArriboChange() {    
    this.secondFormGroup.get('fechaPrevioCtrl').valueChanges    
    .subscribe((data) => { 
      this.secondFormGroup.get('horaPrevioCtrl').updateValueAndValidity();  
      this.secondFormGroup.get('minutoPrevioCtrl').updateValueAndValidity();            
    });
  }  
  hourChange() {
    this.secondFormGroup.get('horaPrevioCtrl').valueChanges    
    .subscribe((data) => {       
      this.secondFormGroup.get('minutoPrevioCtrl').updateValueAndValidity({onlySelf: true, emitEvent: false});
    });
  }
  minuteChange() {
    this.secondFormGroup.get('minutoPrevioCtrl').valueChanges    
    .subscribe((data) => {       
      this.secondFormGroup.get('horaPrevioCtrl').updateValueAndValidity({onlySelf: true, emitEvent: false});
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

    if (event.selectedIndex === 2) {
      this.isThirdFormValid = false;
    }

    if (event.selectedIndex === 4){
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
    else if(!this.thirdFormGroup.valid && index === 2) {  
      this.showAlert("Algunos campos necesitan ser revisados");    
    }

    if (this.firstFormGroup.valid && index === 0) {
      this.validarMasterHouse();
    }

    if (this.thirdFormGroup.valid && index === 2) {
      this.checkPatente();
    }
  }

  private validarMasterHouse() {
    this.processingCreation = true;
    this.isMasterHouseValid = false;
        
    // this.apiService.service_general_get(`/ConsultaMercancia/CheckAWB?Master=${this.firstFormGroup.value.masterCtrl}&House=${this.firstFormGroup.value.houseCtrl}`)
    this.apiService.service_general_get(`/ConsultaMercancia/CheckAWB?Master=${this.firstFormGroup.get('masterCtrl').value}&House=${this.firstFormGroup.get('houseCtrl').value}`)
    .subscribe ( 
    (response:any) => {       
      this.secondFormGroup.get('piezasCtrl').setValue(response.Piezas);
      this.secondFormGroup.get('pesoCtrl').setValue(response.Peso);            
      this.showAlert("Master/House encontrada");      
      this.isMasterHouseValid = true;
      this.processingCreation = false;   
      setTimeout(() => {this.stepper.selectedIndex = 1;});      // For Linear Steppers need this trick
    }, 
    (errorService) => {       
      this.secondFormGroup.value.piezasCtrl = "";                  
      this.secondFormGroup.value.pesoCtrl = "";      
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
    // referencia = "244147";        
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

   //////////////////////
  // Paso 2
  checkGafete() {        
    let gafete = this.thirdFormGroup.get('numGafeteCtrl').value;        
    this.apiService.service_general_get(`/AdelantoPrevios/GetTramitador/${gafete}`)
    .subscribe ( 
    (response:any) => { 
      // console.log(response);      
      this.thirdFormGroup.get('nombreCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('paternoCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('maternoCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('patenteCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('nombreCtrl').setValue(response.Nombre);
      this.thirdFormGroup.get('paternoCtrl').setValue(response.Paterno);
      this.thirdFormGroup.get('maternoCtrl').setValue(response.Materno);
      this.thirdFormGroup.get('patenteCtrl').setValue(response.Patente);      
      this.thirdFormGroup.get('nombreCtrl').disable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('paternoCtrl').disable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('maternoCtrl').disable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('patenteCtrl').disable({onlySelf: true, emitEvent: false});      
    },(errorService) => { 
      // console.log(errorService);
      this.thirdFormGroup.get('nombreCtrl').setValue('');
      this.thirdFormGroup.get('paternoCtrl').setValue('');
      this.thirdFormGroup.get('maternoCtrl').setValue('');
      this.thirdFormGroup.get('patenteCtrl').setValue(''); 
      this.thirdFormGroup.get('nombreCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('paternoCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('maternoCtrl').enable({onlySelf: true, emitEvent: false});
      this.thirdFormGroup.get('patenteCtrl').enable({onlySelf: true, emitEvent: false});  
      // this.showAlert("Gafete no encontrada");
    });
  }  

  ////////////////////
  // Paso 3
  private checkPatente () {
    this.apiService.service_general_get(`/AdelantoPrevios/ValidaPatenteTerceros/${this.thirdFormGroup.get('patenteCtrl').value}`)        
    .subscribe ( 
    (response:any) => {             
      // this.showAlert("PATENTE Valido");      
      this.isThirdFormValid = true;
      this.processingCreation = false;
      setTimeout(() => {this.stepper.selectedIndex = 3;});      // For Linear Steppers need this trick
    }, 
    (errorService) => {             
      // this.showAlert("PATENTE No Valido");      
      this.showAlert(errorService.error.Description);      
      this.processingCreation = false; 
    });  
  }

  public checkPatenteOnChange() {
    this.apiService.service_general_get(`/AdelantoPrevios/ValidaPatenteTerceros/${this.thirdFormGroup.get('patenteCtrl').value}`)        
    .subscribe ( 
    (response:any) => {             
      // this.showAlert("PATENTE Valido");            
      this.processingCreation = false;      
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

    // console.log(this.firstFormGroup.value);
    // console.log(this.secondFormGroup.value);

    this.model.Master = this.firstFormGroup.get('masterCtrl').value;
    this.model.House = this.firstFormGroup.get('houseCtrl').value;
    this.model.Nombre = this.thirdFormGroup.value.nombreCtrl;
    this.model.Paterno = this.thirdFormGroup.value.paternoCtrl;
    this.model.Materno = this.thirdFormGroup.value.maternoCtrl;
    this.model.Patente = this.thirdFormGroup.value.patenteCtrl;
    
    // let f = this.secondFormGroup.value.fechaPrevioCtrl.toISOString();       // 2019-11-23        
    // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)} 12:20`; 
    // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;

    let f = moment(this.secondFormGroup.value.fechaPrevioCtrl).format('YYYYMMDD');    

    if (this.secondFormGroup.value.horaPrevioCtrl < 10){
      f = `${f} 0${this.secondFormGroup.value.horaPrevioCtrl}`;
    } else {
      f = `${f} ${this.secondFormGroup.value.horaPrevioCtrl}`;
    }

    if (this.secondFormGroup.value.minutoPrevioCtrl < 10) {
      f = `${f}:0${this.secondFormGroup.value.minutoPrevioCtrl}`;
    } else {
      f = `${f}:${this.secondFormGroup.value.minutoPrevioCtrl}`;
    }

    this.model.FechaPrevio = f;    

    this.model.NumGafete = this.thirdFormGroup.value.numGafeteCtrl;
    this.model.Piezas = this.secondFormGroup.value.piezasCtrl;
    this.model.Peso = this.secondFormGroup.value.pesoCtrl;
    this.model.Etiquetado = this.secondFormGroup.value.etiquetadoCtrl;

    if (this.thirdFormGroup.value.comentarioCtrl == "") {            
      this.model.Seguimiento[0].Comentarios = "";
    } else {      
      this.model.Seguimiento[0].Comentarios = this.thirdFormGroup.value.comentarioCtrl;;
    }

    // console.log(this.model);    
    // console.log(this.model.FechaPrevio);    
  }

  crearPrevio () {
    if (this.processingCreation) { return; }
    
    this.processingCreation = true;
    this.apiService.service_general_post(`/AdelantoPrevios/CrearAdelantoPrevios`, this.model)
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



}