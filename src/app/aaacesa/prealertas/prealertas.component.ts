import { Component, ViewEncapsulation, OnInit, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Prealertas
import { PrealertaBusqueda, PrealertaSeguimiento, Documento, PrealertaNuevo, EstatusTransferencia } from '../../models/prealertas.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

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
  
  loading = false;  
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

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
  public estatusTransferencia = [];         // EstatusTransferenciaDetalle
  dataSource = new MatTableDataSource();    // Data usada en la Mat Table

  displayedColumns: string[] = ['IdPrealerta', 'GuiaMaster', 'GuiaHouse', 'InstruccionesManejo', 'FechaArribo', 'Consignatario', 'Estatus', 'Acciones'];    
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
  modelSeguimiento:PrealertaSeguimiento = new PrealertaSeguimiento();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC SECTION    
  
  constructor(private http: Http, private apiService:ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar) {
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
    this.loading = true;

    // Estatus seleccionado "Niguno"
    if (typeof this.busquedaModel.ClaveInstruccionManejo === "undefined"){
      this.busquedaModel.ClaveInstruccionManejo = "";
    }
        
    // FechaPrevio
    if (this.fechaPrevioSearch != null){            
      // moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS')
      // console.log( moment(this.fechaPrevioSearch).format('YYYYMMDD'));      
      // let f = this.fechaPrevioSearch.toISOString().slice(0,10); // 2019-11-23        
      // f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;     // 20191123
      // this.busquedaModel.FechaArribo = f; 
      this.busquedaModel.FechaArribo = moment(this.fechaPrevioSearch).format('YYYYMMDD');
    } else {
      this.busquedaModel.FechaArribo = "";
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

    console.log(this.busquedaModel);
    this.apiService.service_general_get_with_params('/Prealertas/Busqueda', this.busquedaModel)
      .subscribe ( 
      (response:any) => {                 
        this.data = response;        
        this.dataSource.data = this.data;
        this.updateCountStatus();
        this.loading = false;
      }, 
      (errorService) => { console.log(errorService); this.loading = false;});            
  }

  buscaPrealertasNueva () {
    this.busquedaModel.Clean();
    this.fechaPrevioSearch = null;
    this.rangoFechaSearch = [];
    this.buscarPrealertas();
  }

  public verDetalle (id: string) {    
    this.loading = true;
    this.detailData = {};
    this.modelSeguimiento.cleanSeguimiento();      
    
    this.apiService.service_general_get(`/Prealertas/GetDetailsById/${id}`)
    .subscribe ( 
    (response:any) => { 
      this.detailData = response; 
      this.getEstatusTransferencia(response.GuiaMaster, response.GuiaHouse);
      console.log(this.estatusTransferencia);
      this.loading = false;
    }, 
    (errorService) => { console.log(errorService); this.loading = false; });    
  } 

  private getEstatusTransferencia(master:string, house:string) {    
    this.estatusTransferencia = [];        
    this.apiService.service_general_get(`/ConsultaMercancia/GetEstatusTransferencia?Master=${master}&House=${house}`)
    .subscribe ( 
    (response:any) => { 
      console.log(response);
      let keys = Object.keys(response);
      keys.splice(0, 4);

      if (Array.isArray(keys) && keys.length) {
        for (let i=0; i<keys.length; i+=2) {    
          if (response[keys[i]]){
            this.estatusTransferencia.push(new EstatusTransferencia(keys[i], response[keys[i+1]]));
          }              
        }        
      }
      // console.log(this.estatusTransferencia);
    }, 
    (errorService) => { console.log(errorService);});
  }
  
  ///////////////////////////////
  // Update Seguimiento
  public updateSeguimiento (estado:string) {
    this.loading = true;
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
    this.apiService.service_general_get(`/Prealertas/GetDocumentById/${idDocumento}`)
      .subscribe ( 
      (response:any) => {         
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Archivo}`);                              
        // element.setAttribute('target','_blank');
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
// Crear Prealertas Stepper - Dialog Component
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
  isMasterHouseValid = false;
  secondFormGroup: FormGroup;   
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  minDate = new Date();

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
    public snackBar: MatSnackBar) {

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
      horaPrevioCtrl: ['', [Validators.required, Validators.min(0), Validators.max(23), this.hourValidation.bind(this)]],
      minutoPrevioCtrl: ['', [Validators.required, Validators.min(0), Validators.max(59), this.minuteValidation.bind(this)]],
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
    
    this.fechaArriboChange();
  }

  hourValidation (control: FormControl): {[s:string]:boolean} {
    let currentTime = parseInt(moment(new Date()).format('HH'));    
    let selectedTime = parseInt(control.value);
    
    if (!this.hasOwnProperty('secondFormGroup')) { return {hour:true} }

    let date = moment(this.secondFormGroup.controls.fechaArriboCtrl.value).format('DD/MM/YYYY');
    let today = moment(new Date()).format('DD/MM/YYYY');      
    console.log(today === date);        

    if (selectedTime < currentTime && (today === date)) { return { hour:true } } // fallando          
    return null; // validacion pasa
  }

  minuteValidation (control: FormControl): {[s:string]:boolean} {
    let currentTime = parseInt(moment(new Date()).format('mm'));    
    let selectedTime = parseInt(control.value);
    
    if (!this.hasOwnProperty('secondFormGroup')) { return {minute:true} }

    let date = moment(this.secondFormGroup.controls.fechaArriboCtrl.value).format('DD/MM/YYYY');
    let today = moment(new Date()).format('DD/MM/YYYY');      
    console.log(today === date);        
    // let hour = this.secondFormGroup.controls.horaPrevioCtrl.value;    
    
    if (selectedTime < currentTime && (today === date) ) { return { minute:true } } // fallando          
    return null; // validacion pasa
  }

  fechaArriboChange() {    
    this.secondFormGroup.get('fechaArriboCtrl').valueChanges    
    .subscribe((data) => {
      console.log(data);
      this.secondFormGroup.get('horaPrevioCtrl').updateValueAndValidity();  
      this.secondFormGroup.get('minutoPrevioCtrl').updateValueAndValidity();            
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

    if (this.firstFormGroup.valid) {
      // this.validarMasterHouse();
    }
  }

  private validarMasterHouse() {
    this.processingCreation = true;
    
    this.apiService.service_general_get(`/ConsultaMercancia/CheckAWB?Master=${this.firstFormGroup.value.masterCtrl}&House=${this.firstFormGroup.value.houseCtrl}`)
    .subscribe ( 
    (response:any) => {       
      this.secondFormGroup.get('piezasCtrl').setValue(response.Piezas);
      this.secondFormGroup.get('pesoCtrl').setValue(response.Peso);      
      this.processingCreation = false;
      this.showAlert("Master/House encontrada");
      this.isMasterHouseValid = true;
    }, 
    (errorService) => { 
      // console.log(errorService); 
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

  guardarFirstForm () {    
    // if (this.model.Documentos.length < 1) { this.showAlert("Mínimo subir un documento"); return; }
    
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
    
    // let f = this.secondFormGroup.value.fechaArriboCtrl.toISOString();       // 2019-11-23            
    // f = `${f.slice(8,10)}/${f.slice(5,7)}/${f.slice(0,4)}`;
    let f = moment(this.secondFormGroup.value.fechaArriboCtrl).format('DD/MM/YYYY');    

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

    this.model.FechaArribo = f;    
    
    if (this.secondFormGroup.value.comentarioCtrl == "") {            
      this.model.Seguimiento[0].Comentarios = "";
    } else {      
      this.model.Seguimiento[0].Comentarios = this.secondFormGroup.value.comentarioCtrl;;
    }

    // console.log(this.model);    
    // console.log(this.model.FechaPrevio);    
  }

  crearPrealerta () {
    if (this.processingCreation) { return; }
    
    this.processingCreation = true;
    this.apiService.service_general_post(`/Prealertas/CrearPrealerta`, this.model)
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