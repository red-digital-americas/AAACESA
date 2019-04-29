import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';

import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ApiServices } from '../../services/api.services';

@Component({
  templateUrl: 'abandono.component.html',
  providers: [ApiServices]
})
// export class DataTableComponent {
export class AbandonoComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['nombre', 'telefono', 'rfc', 'patente', 'perfil', 'activo', 'acciones'];
  dataSource = new MatTableDataSource();
  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public myModal;
  public detalle;
  
  constructor(private http: Http, private apiserv: ApiServices) {
   }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasDisponibles').subscribe((numCuentas) => {
      this.numCuentas = numCuentas;
    });
    this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasAsociadas').subscribe((data) => {
      this.dataSource = data;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

}

