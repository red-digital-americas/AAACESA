import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort, MatTabChangeEvent, MatSnackBar } from '@angular/material';
// import { ApiServices } from '../../services/api.services';
import { facturasBusqueda } from '../../models/finanzas.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ApiServices } from '../../services/api.services';

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
  
    this.InvoicesPaginator._intl.itemsPerPageLabel = "Registros por página";
    this.CreditNotesPaginator._intl.itemsPerPageLabel = "Registros por página";
    this.PaidComplementPaginator._intl.itemsPerPageLabel = "Registros por página";
    this.AccountStatusPaginator._intl.itemsPerPageLabel = "Registros por página";
   /*  this.dataSource.paginator = this.paginator; */
    this.dataSource.paginator = this.InvoicesPaginator;
    this.dataSources.paginator = this.CreditNotesPaginator;
    this.info.paginator = this.PaidComplementPaginator;
    this.account.paginator = this.AccountStatusPaginator;
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


  constructor(private http: Http, private apiserv: ApiServices, public snackBar: MatSnackBar) { }

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

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.rangoFechaSearch = [];
    if(tabChangeEvent.index == 0)
    {
      this.dataSource.data = [];
      this.apiserv.service_general_get('/Finanzas/GetFacturas').subscribe((data) => {
        this.dataSource.data = [];
      });
    }
    else if (tabChangeEvent.index == 1) {
      this.dataSources.data = [];
      this.apiserv.service_general_get('/Finanzas/GetNotasCredito').subscribe((res) => {
        this.dataSources.data = [];
      });
    }
    else if (tabChangeEvent.index == 2) {
      this.info.data = [];
      this.apiserv.service_general_get('/finanzas/GetComplementoDePago').subscribe((com) => {
        this.info.data = [];
      })
    }
    else if (tabChangeEvent.index == 3) {
      this.account.data = [];
      this.apiserv.service_general_get('/Finanzas/GetEstadoDeCuenta').subscribe((stat) => {
        this.account.data = [];
      })
    }
  }

  public toInt(num: string) {
    return + num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
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
    console.log(this.busquedaModel);
    this.loading = true;
    this.apiserv.service_general_get_with_params('/Finanzas/GetFacturas', this.busquedaModel[0])
      .subscribe ( 
      (response:any) => {
        this.data = response;
        this.dataSource.data = this.data;
        this.dataSource.data = [...this.dataSource.data];
        this.loading = false;
        this.dataSource.paginator = this.InvoicesPaginator;
      }, 
      (errorService) => {
        console.log(errorService); this.loading = false;
        this.showAlert(errorService.error);
      });
  }

  public NuevaBusquedaFinanzas(){
    this.clear.Clean();
    this.fechaEmisionSearch = null;
    this.rangoFechaSearch = [];
    this.Pedimento = [];
    this.dataSource.data = [];
    this.dataSource.data = [...this.dataSource.data];
  }

  public getPDFInvoices(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.Folio, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaFacturaPDF`, params).subscribe (
      (response:any) => {
        console.log(response);
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
      (errorService) => { console.log(errorService); });     
  }
 

  public getXMLInvoices(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.FolioFactura, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaFacturaXML`, params).subscribe (
      (response:any) => {
        console.log(response);
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
      (errorService) => { console.log(errorService); });
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
    console.log(this.busquedaModel);
    this.apiserv.service_general_get_with_params('/Finanzas/GetNotasCredito', this.busquedaModel[1])
      .subscribe ( 
      (response:any) => {
        this.data = response;    
        this.dataSources.data = this.data;
        this.dataSources.data = [...this.dataSources.data];
        this.loading = false;
      }, 
      (errorService) => { 
        console.log(errorService); this.loading = false;
        this.showAlert(errorService.error);
      });
  }

  public NuevaBusquedaNotas(){
    this.clear.Clean();
    this.fechaEmisionSearch = null;
    this.rangoFechaSearch = [];
    this.Pedimento = [];
    this.dataSources.data = [];
    this.dataSources.data = [...this.dataSources.data];
  }

  public getPDF(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.Folio, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaNotaCreditoPDF`, params).subscribe (
      (response:any) => {
        console.log(response);
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
        console.log(errorService);
        this.showAlert(errorService.error);
       });   
        
  }
 

  public getXML(element){
    let format = moment(element.FechaEmision).format('YYYYMMDD');
    let params = {FolioFactura:element.Folio, FechaEmision:format}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaNotaCreditoXML`, params).subscribe (
      (response:any) => {
        console.log(response);
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
        console.log(errorService);
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
    console.log(this.busquedaModel);
    this.apiserv.service_general_get_with_params('/Finanzas/GetComplementoDePago', this.busquedaModel[2])
      .subscribe ( 
      (response:any) => {
        this.data = response;    
        this.info.data = this.data;
        this.info.data = [...this.info.data];
        this.loading = false;
      }, 
      (errorService) => { 
        console.log(errorService); this.loading = false;
      });
  }

  public NuevaBusquedaComplemento(){
    this.clear.Clean();
    this.fechaEmisionSearch = null;
    this.rangoFechaSearch = [];
    this.Pedimento = [];
    this.info.data = [];
    this.info.data = [...this.info.data];
  }
  public getComplementoPDF(element){
    let params = {UUID:element.UUID}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaComplementoPagoPDF`, params).subscribe (
      (response:any) => {
        console.log(response);
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
        console.log(errorService);
        this.showAlert(errorService.error);
      });     
  }
 

  public getComplementoXML(element){
    let params = {UUID:element.UUID}
    this.apiserv.service_general_get_with_params(`/Finanzas/DescargaComplementoPagoXML`, params).subscribe (
      (response:any) => {
        console.log(response);
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
      /* (errorService) => { console.log(errorService); }); */
      (errorService) => { 
        console.log("errorService");
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
    console.log(this.busquedaModel);
    this.apiserv.service_general_get_with_params('/Finanzas/GetEstadoDeCuenta', this.busquedaModel[3])
      .subscribe ( 
      (response:any) => {
        this.data = response;    
        this.account.data = this.data;
        this.account.data = [...this.account.data];
        this.loading = false;
      }, 
      (errorService) => { 
        console.log(errorService); this.loading = false;
        /* this.showAlert(errorService.error); */
        this.showAlert("Rango de fechas no válido");  
      });
  }
  

  public NuevaBusquedaEstados(){
    this.clear.Clean();
    this.fechaEmisionSearch = null;
    this.rangoFechaSearch = [];
    this.Pedimento = [];
    this.account.data = [];
    this.account.data = [...this.account.data];
  }

}
