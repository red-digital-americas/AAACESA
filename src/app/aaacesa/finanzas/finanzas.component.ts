import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort, MatTabChangeEvent, MatSnackBar } from '@angular/material';
// import { ApiServices } from '../../services/api.services';
import { facturasBusqueda } from '../../models/finanzas.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ApiServices } from '../../services/api.services';

import { BsLocaleService } from 'ngx-bootstrap';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
  './finanzas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class FinanzasComponent implements OnInit, AfterViewInit{

  @ViewChild('InvoicesPaginator', {read:MatPaginator}) InvoicesPaginator: MatPaginator;
  @ViewChild('CreditNotesPaginator',{read:MatPaginator}) CreditNotesPaginator: MatPaginator;
  @ViewChild('PaidComplementPaginator',{read:MatPaginator}) PaidComplementPaginator: MatPaginator;
  @ViewChild('AccountStatusPaginator',{read:MatPaginator}) AccountStatusPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  //Variables busquedas por fecha
  loading = false;
  busquedaModel = new Array<facturasBusqueda>();
  clear:facturasBusqueda = new facturasBusqueda();
  fechaEmisionSearch:Date = null;


  displayedColumns: string[] = ['Master', 'House', 'Folio', 'Importe', 'Pedimento', 'FechaEmision', 'Descargar'];
  CPColumns: string[] = ['UUID', 'FechaTimbrado', 'Folio', 'Importe', 'RFC', 'RazonSocial', 'FoliosRelacionados', 'Descargar'];
  EdoCtaColumns: string[] = ['MasterHouse', 'Folio', 'Pedimento', 'Cliente', 'ImporteFactura', 'ImporteFaltante', 'FechaFactura', 'DiasVencidos', 'Estatus'];
  
  dataSource = new MatTableDataSource();
  dataSources = new MatTableDataSource();
  info = new MatTableDataSource();
  account = new MatTableDataSource();

  tmpdataSource = [];
  tmpdataSources = [];
  tmpinfo = [];
  tmpaccount = [];

  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public fechaPrevioSearch:Date = null;
  public filterQueryDate: Date = null;
  public rangoFechaSearch:any = [];
  public Pedimento: any = [];
  public myModal;
  public detalle;
  apiService: any;

  private showAlert (msj:string) {
    this.snackBar.open(msj, "", {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  ngAfterViewInit() {      
   /*  this.dataSource.paginator = this.paginator; */
    this.dataSource.paginator = this.InvoicesPaginator;
    this.dataSources.paginator = this.CreditNotesPaginator;
    this.info.paginator = this.PaidComplementPaginator;
    this.account.paginator = this.AccountStatusPaginator;
    // this.InvoicesPaginator._intl.itemsPerPageLabel = "Registros por página";    
      
    this.dataSource.sort = this.sort;     
    this.dataSource.sortingDataAccessor = (item, property) => {      
      switch (property) {     
        case 'FechaEmision': {
          let f = item['FechaEmision'].split(' ')[0];                // 07/05/2019 12:00 PM          
          f = `${f.slice(3,5)}/${f.slice(0,2)}/${f.slice(6,10)}`;   // 05/07/2019
          let newDate = new Date(f);
          return newDate;
        }
        default: { return item[property];} 
      }
    };
  }


  constructor(private http: Http, private apiserv: ApiServices, public snackBar: MatSnackBar, private localeService: BsLocaleService) { 
    this.localeService.use('es');
  }

  ngOnInit() {
    for(var i = 0;i <= 3; i++ ){
      var fac = new facturasBusqueda();
      this.busquedaModel.push(fac);
    }

    this.dataSource.data = [];
    this.dataSources.data = [];
    this.info.data = [];
    this.account.data = [];
  }

  public generalSearch() {
    this.dataSource.data = this.filterValue(this.tmpdataSource, this.filterQuery);
    this.dataSources.data = this.filterValue(this.tmpdataSources, this.filterQuery);
    this.info.data = this.filterValue(this.tmpinfo, this.filterQuery);
    this.account.data = this.filterValue(this.tmpaccount, this.filterQuery);
  }

  private filterValue(items:any, term:any) {
    if (Array.isArray(items) && items.length && term && term.length) {
      return items.filter(item => {
        let keys = Object.keys(item);
        if (Array.isArray(keys) && keys.length) {
          for (let key of keys) {
            if (item.hasOwnProperty(key) && item[key] && item[key].length && (item[key].toString().toLowerCase().replace(/ /g, '')).includes((term.toString().toLowerCase().replace(/ /g, '')))) {
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      });
    } else {
      return items;
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.rangoFechaSearch = "";
    this.busquedaModel[tabChangeEvent.index].Pedimento = "";
    
    if(tabChangeEvent.index == 0)
    {
      this.tmpdataSource = [];
      this.dataSource.data = [];    
    }
    else if (tabChangeEvent.index == 1) {
      this.tmpdataSources= [];
      this.dataSources.data = [];      
    }
    else if (tabChangeEvent.index == 2) {
      this.info.data = [];
      this.tmpinfo = [];      
    }
    else if (tabChangeEvent.index == 3) {
      this.tmpaccount = [];
      this.account.data = [];      
    }
  } 

  public facturasBusqueda(){
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        this.busquedaModel[0].FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaModel[0].FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {
      this.busquedaModel[0].FechaInicial = "";
      this.busquedaModel[0].FechaFinal = "";
    }        
    this.loading = true;
    this.apiserv.service_general_get_with_params('/Finanzas/GetFacturas', this.busquedaModel[0])
      .subscribe ( 
      (response:any) => {        
        this.tmpdataSource = response;
        this.dataSource.data = this.tmpdataSource;        
        this.loading = false;        
      }, 
      (errorService) => {
        // this.tmpdataSource = [];
        // this.dataSource.data = this.tmpdataSource;
        this.loading = false;
        this.showAlert(errorService.error);
      });
  }

  public NuevaBusquedaFinanzas(){    
    this.busquedaModel[0].Clean();    
    this.rangoFechaSearch = "";
    // this.Pedimento = [];
    this.dataSource.data = [];  
  }

  public getPDFInvoices(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.Folio, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaFacturaPDF`, params).subscribe (
      (response:any) => {
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Content}`);                              
        element.setAttribute('download', response.Nombre);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+ encodeURI(response.Archivo), "_blank");
        }  
      }, 
      (errorService) => {

       });     
  }
 

  public getXMLInvoices(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.FolioFactura, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaFacturaXML`, params).subscribe (
      (response:any) => {
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Content}`);                              
        element.setAttribute('download', response.Nombre);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+ encodeURI(response.Archivo), "_blank");
        }  
      }, 
      (errorService) => { 

       });
  }

  

  // Notas de Credito ******************************************************************************************
  
  public notasBusqueda(){
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        this.busquedaModel[1].FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaModel[1].FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {
      this.busquedaModel[1].FechaInicial = "";
      this.busquedaModel[1].FechaFinal = "";
    }        
    this.loading = true;
    this.apiserv.service_general_get_with_params('/Finanzas/GetNotasCredito', this.busquedaModel[1])
      .subscribe ( 
      (response:any) => {
        this.tmpdataSources = response;    
        this.dataSources.data = this.tmpdataSources;        
        this.loading = false;
      }, 
      (errorService) => { 
        this.loading = false;
        this.showAlert(errorService.error);
      });
  }

  public NuevaBusquedaNotas(){    
    this.busquedaModel[1].Clean();    
    this.rangoFechaSearch = "";
    // this.Pedimento = [];     
    this.dataSources.data = [];    
  }

  public getPDF(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.Folio, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaNotaCreditoPDF`, params).subscribe (
      (response:any) => {
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Content}`);                              
        element.setAttribute('download', response.Nombre);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+ encodeURI(response.Archivo), "_blank");
        }  
      }, 
      (errorService) => { 
        this.showAlert(errorService.error);
       });   
        
  }
 

  public getXML(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.Folio, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaNotaCreditoXML`, params).subscribe (
      (response:any) => {
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Content}`);                              
        element.setAttribute('download', response.Nombre);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+ encodeURI(response.Archivo), "_blank");
        }  
      }, 
      (errorService) => { 
        this.showAlert(errorService.error);
       });
  }

  //Complemento de pago ******************************************************************************************

  public ComplementoBusqueda(){
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        this.busquedaModel[2].FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaModel[2].FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {
      this.busquedaModel[2].FechaInicial = "";
      this.busquedaModel[2].FechaFinal = "";
    }        
    this.loading = true;
    this.apiserv.service_general_get_with_params('/Finanzas/GetComplementoDePago', this.busquedaModel[2])
      .subscribe ( 
      (response:any) => {
        this.tmpinfo = response;    
        this.info.data = this.tmpinfo;        
        this.loading = false;
      }, 
      (errorService) => { 
        this.loading = false;
      });
  }

  public NuevaBusquedaComplemento(){
    this.busquedaModel[2].Clean();    
    this.rangoFechaSearch = "";
    // this.Pedimento = [];     
    this.info.data = [];       
  }
  public getComplementoPDF(element){
    let params = {UUID:element.UUID}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaComplementoPagoPDF`, params).subscribe (
      (response:any) => {
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Content}`);                              
        element.setAttribute('download', response.Nombre);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+ encodeURI(response.Archivo), "_blank");
        }  
      }, 
      (errorService) => { 
        this.showAlert("Archivo no disponible");
      });     
  }
 

  public getComplementoXML(element){
    let params = {UUID:element.UUID}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaComplementoPagoXML`, params).subscribe (
      (response:any) => {
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Content}`);                              
        element.setAttribute('download', response.Nombre);
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        // For browser with no support of download attribute
        if (typeof element.download == undefined) {
          window.open("data:application/pdf;base64,"+ encodeURI(response.Archivo), "_blank");
        }  
      }, 
      (errorService) => { 
        this.showAlert("Archivo no disponible");
      });
  }


  //Estados de cuenta **********************************************************************************************
  public EstadosBusqueda(){
    
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        this.busquedaModel[3].FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaModel[3].FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {
      this.busquedaModel[3].FechaInicial = "";
      this.busquedaModel[3].FechaFinal = "";
    }        
    this.loading = true;
    this.apiserv.service_general_get_with_params('/Finanzas/GetEstadoDeCuenta', this.busquedaModel[3])
      .subscribe ( 
      (response:any) => {
        this.tmpaccount = response;    
        this.account.data = this.tmpaccount;        
        this.loading = false;
      }, 
      (errorService) => { 
 this.loading = false;
        /* this.showAlert(errorService.error); */
        this.showAlert("Rango de fechas no válido");  
      });
  }
  

  public NuevaBusquedaEstados(){
    this.busquedaModel[3].Clean();    
    this.rangoFechaSearch = "";
    // this.Pedimento = [];         
    this.account.data = [];    
  }

}
