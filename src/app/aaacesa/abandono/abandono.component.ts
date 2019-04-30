import { Component, ViewEncapsulation, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort, MatTabChangeEvent } from '@angular/material';
import { ApiServices } from '../../services/api.services';

@Component({
  templateUrl: 'abandono.component.html',
  providers: [ApiServices]
})
// export class DataTableComponent {
export class AbandonoComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  displayedColumns: string[] = ['Master', 'House', 'Piezas', 'Peso', 'FechaAbandono'];
  dataSource = new MatTableDataSource();
  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public myModal;
  public detalle;

  constructor(private http: Http, private apiserv: ApiServices) {   }

  ngOnInit() {
    this.apiserv.service_general_get('/Abandono/GetPreNotificacion').subscribe((data) => {
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
      this.apiserv.service_general_get('/Abandono/GetPreNotificacion').subscribe((data) => {
        this.dataSource.data = data;
      });
    }
    else{
      this.apiserv.service_general_get('/Abandono/GetNotificacion').subscribe((res) => {
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

