import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
  selector: 'app-prealertas',
  templateUrl: './prealertas.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss',
    './prealertas.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class PrealertasComponent {  
  
  ///////////////////////
  // Catalogos para los <select>
  instruccionesManejoCatalogo = [];
  almacenOrigenCatalogo = [];
  rangoTemperaturaCatalogo = [];
  metodoPagoCatalogo = [];
  usoCFDICatalogo = [];
  condicionesAlmacenesCatalogo = [];

  ///////////////////////
  // BusquedaSuperior
  showAdvanceSearch = true; // Don't Change
  masterHouseSearch = "";
  masterGuideSearch = "";
  bsFechaEstimada:any = "";    
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  statusSearch = "";
  referenciaSearch = "";
  instruccionesSearch = "";
  idPrealertaSearch = "";

  ///////////////////////
  // Status Filter Bar
  public statusEnum = ['Aceptada', 'Solicitada', 'P.AAACESA', 'P.Cliente', 'Rechazada', 'Finalizada'];
  public countStatus = {"Aceptada": 0, "Solicitada": 0, "PAAACESA": 0, "PCliente": 0, "Rechazada": 0, "Finalizada": 0}  
  
  ///////////////////////
  // Modals
    // Form Crear Pre Alerta
    // public myModal;
    // public myModal2;
    // public myModal3;  
    // public confirmationModal;
    // public responseModal;
    // // Ver Detalle
    // public detalleModal;

  ////////////////////////
  // Data Table
  public filterData;        // Data usada en el DataTable
  public data = [];         // Data original consultada del servicio  
  public detailData = {};   // Registro con el detalle obtenido
  
  ////////////////////////
  // Forms    
  model:PreAlertaModel = new PreAlertaModel( 
    '', '','Solicitada', '', null, null, null, '', '', '', '', '', '', true, '', '', []
  );  
  nFiles = [];      // Usado para poder añadir mas archivos en la parte del formulario crear Pre Alerta
  response = "";    // Respuesta al momento de crear Pre Alerta
  @ViewChild('form1', { read: NgForm }) form1: any;   // Referencia al form de la vista
  @ViewChild('form2', { read: NgForm }) form2: any;   // Referencia al form2 de la vista
  
  constructor(private http: Http, private catalogosService:CatalogosService) {

    http.get('assets/prealertas.json')
      .subscribe((data) => {
        setTimeout(() => {
          this.data = data.json();
          this.filterData = this.data;
          this.updateCountStatus();
        }, 2000);
      });  
      
    this.catalogosService.GetInstruccionesManejo()
      .subscribe ( 
        (response:any) => { this.instruccionesManejoCatalogo = response;}, 
        (errorService) => { console.log(errorService); });

    this.catalogosService.GetAlmacenOrigen()
      .subscribe ( 
        (response:any) => { this.almacenOrigenCatalogo = response;}, 
        (errorService) => { console.log(errorService); });

    this.catalogosService.GetRangoTemperatura()
      .subscribe ( 
        (response:any) => { this.rangoTemperaturaCatalogo = response;}, 
        (errorService) => { console.log(errorService); });
    
    this.catalogosService.GetMetodoPago()
      .subscribe ( 
        (response:any) => { this.metodoPagoCatalogo = response;}, 
        (errorService) => { console.log(errorService); }); 

    this.catalogosService.GetUsoCFDI()
      .subscribe ( 
        (response:any) => { this.usoCFDICatalogo = response;}, 
        (errorService) => { console.log(errorService); }); 
        
    this.catalogosService.GetCondicionesAlmacenes()
      .subscribe ( 
        (response:any) => { this.condicionesAlmacenesCatalogo = response;}, 
        (errorService) => { console.log(errorService); });                 
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

  public updateCountStatus () {
    this.countStatus.Aceptada = this.data.filter(function (el) {return el.status === 'Aceptada'; }).length;
    this.countStatus.Solicitada = this.data.filter(function (el) {return el.status === 'Solicitada'; }).length;
    this.countStatus.PAAACESA = this.data.filter(function (el) {return el.status === 'P.AAACESA'; }).length;
    this.countStatus.PCliente = this.data.filter(function (el) {return el.status === 'P.Cliente'; }).length;
    this.countStatus.Rechazada = this.data.filter(function (el) {return el.status === 'Rechazada'; }).length;
    this.countStatus.Finalizada = this.data.filter(function (el) {return el.status === 'Finalizada'; }).length;
  }

  public applyFilter(index: number) {
    this.filterData = [];

    // In the view we sent the index corresponding with the enum, and for all a bigger number ex: 10
    if (index < this.statusEnum.length) {
      this.filterData = this.data.filter (function (el) { return  el.status == this.statusEnum[index];}.bind(this));
    } else {
      this.filterData = this.data;
    }
  }
  
  public verDetalle (id: string) {      
    let tmp;  
    tmp = this.data.filter (function (el) {
      return el.idPreAlerta === id;
    });
    
    this.detailData = tmp[0];    
    // console.log(this.detailData);    
    // var newArray = homes.filter(function (el) { return el.price <= 1000 && el.sqft >= 500 && el.num_of_beds >=2; });
  }


  // For Collapse in detail View
  collapseList = [0, 0, 0];
  expandedIndex = -1;
  Collaps(index: number) {  
    this.expandedIndex = index === this.expandedIndex ? -1 : index;          
  }    

  //////////////////////////////////
  // Forms Logic - Crear Pre Alerta
  addDocument () { this.nFiles.push(0); }   // Add Dynamically a new input file
  removeDocument () { this.nFiles.pop(); }  // Remove Dynamically a new input file

  onFileChanged(event, index:number) {
    if (this.model.attachments.length < index) {
      this.model.attachments.push(event.target.files[0]);
    } else {
      this.model.attachments[index] = event.target.files[0];
    }    
  }

  crearPreAlerta() {
    //console.log (this.model);    
    // Servicio para subir el modelo
    this.response = "0123456";
    this.form1.reset();
    this.form2.reset();
    this.cleanModel();    
  }

  // saveForm($event: Event) {
  //   $event.preventDefault();    
  //   //if (this.form.valid) {
  //   //   console.log(this.form1.value);
  //   //   console.log (this.form2.value);              
  //  }

  private cleanModel () { 
    this.model = new PreAlertaModel( 
    '', '','Solicitada', '', null, null, null, '', '', '', '', '', '', true, '', '', []);  
    this.nFiles = [];
  }

}

export class PreAlertaModel {    
  constructor(
    public masterguide: string,
    public houseguide: string,
    public status: string,
    public referencia: string,
    public piezas: number,
    public peso: number,
    public fechaArribo: Date,
    public almacenOrigen: string,
    public rangoTemperatura: string,
    public consignatario:string,
    public metodoPago: string,
    public usoCFDI: string,
    public condicionesAlmacenes: string,
    public consolidado: boolean,
    public instruccionesManejo: string,
    public comentario: string,
    public attachments:File[]
  ) {  }
}