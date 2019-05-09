import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort, MatTabChangeEvent } from '@angular/material';
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
export class FinanzasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('CreditNotesPaginator',{read:MatPaginator}) CreditNotesPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  displayedColumns: string[] = ['Master', 'House', 'Folio', 'Valor', 'Pedimento', 'FechaDeEmision', 'Descargar'];
  CPColumns: string[] = ['UUID', 'FechaTimbrado', 'Folio', 'Valor', 'RFC', 'RazonSocial', 'FoliosRelacionados', 'Descargar'];
  EdoCtaColumns: string[] = ['MasterHouse', 'Folio', 'Pedimento', 'Cliente', 'ImporteFactura', 'ImporteFaltante', 'FechaFactura', 'DiasVencidos', 'Estatus', 'Descargar'];
  dataSource = new MatTableDataSource();
  dataSources = new MatTableDataSource();
  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public fechaPrevioSearch:Date = null;
  public filterQueryDate: Date = null;
  rangoFechaSearch:any = [];
  public myModal;
  public detalle;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSources.paginator = this.CreditNotesPaginator;
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


  constructor(private http: Http, private apiserv: ApiServices) { }

  ngOnInit() {
    this.dataSource.data = [];
    this.dataSources.data = [];
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.dataSource.data = [];
    if(tabChangeEvent.index == 0)
    {
      this.apiserv.service_general_get('/Finanzas/GetFacturas').subscribe((data) => {
        this.dataSource.data = data;
      });
    }
    else if (tabChangeEvent.index == 1) {
      this.dataSources.data = [];
      this.apiserv.service_general_get('/Finanzas/GetNotasCredito').subscribe((res) => {
        this.dataSources.data = res;
      });
    }
    else if (tabChangeEvent.index == 2) {
      this.dataSource.data = [];
      this.apiserv.service_general_get('/finanzas/GetComplementoDePago').subscribe((res) => {
        this.dataSource.data = res;
      })
    }
    else if (tabChangeEvent.index ==3) {
      this.dataSource.data = [];
      this.apiserv.service_general_get('/Finanzas/GetEstadoDeCuenta?FechaInicial=20180402&FechaFinal=20190430').subscribe((res) => {
        this.dataSource.data = res;
      })
    }
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }
  
}
