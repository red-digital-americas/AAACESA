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
  
  @ViewChild('PreNotificacionesPaginator', {read:MatPaginator}) PreNotificacionesPaginator: MatPaginator;
  @ViewChild('NotificacionesPaginator',{read:MatPaginator}) NotificacionesPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  displayedColumns: string[] = ['Master', 'House', 'Piezas', 'Peso', 'FechaAbandono'];
  dataSource = new MatTableDataSource();
  tmpdataSource = [];
  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public myModal;
  public detalle;

  constructor(private http: Http, private apiserv: ApiServices) {   }

  ngOnInit() {
    this.apiserv.service_general_get('/Abandono/GetPreNotificacion').subscribe((data) => {
      this.tmpdataSource = data;        
      this.dataSource.data = this.tmpdataSource;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.PreNotificacionesPaginator;    
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.dataSource.data = [];
    if(tabChangeEvent.index == 0)
    {
      this.apiserv.service_general_get('/Abandono/GetPreNotificacion').subscribe((data) => {        
        this.tmpdataSource = data;              
        this.dataSource.data = this.tmpdataSource;
        this.dataSource.paginator = this.PreNotificacionesPaginator;  
      });
    }
    else{
      this.apiserv.service_general_get('/Abandono/GetNotificacion').subscribe((res) => {
        this.tmpdataSource = res;         
        this.dataSource.data = this.tmpdataSource; 
        this.dataSource.paginator = this.NotificacionesPaginator;      
      });
    }
  }

  public generalSearch() {
    this.dataSource.data = this.filterValue(this.tmpdataSource, this.filterQuery);    
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
}

