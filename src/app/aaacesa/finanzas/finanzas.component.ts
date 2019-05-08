import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort, MatTabChangeEvent } from '@angular/material';
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.scss'],
  providers: [ApiServices]
})
export class FinanzasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  displayedColumns: string[] = ['Master', 'House', 'Folio', 'Tipo', 'Valor', 'Pedimento', 'FechaDeEmision', 'Descargar'];
  dataSource = new MatTableDataSource();
  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public myModal;
  public detalle;


  constructor(private http: Http, private apiserv: ApiServices) { }

  ngOnInit() {
    this.apiserv.service_general_get('/Finanzas/GetFacturas').subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.dataSource.data = [];
    if(tabChangeEvent.index == 0)
    {
      this.apiserv.service_general_get('/Finanzas/GetFacturas').subscribe((data) => {
        this.dataSource.data = data;
      });
    }
    else{
      this.apiserv.service_general_get('/Finanzas/GetFacturas').subscribe((res) => {
        this.dataSource.data = res;
      });
    }
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }
  
}
