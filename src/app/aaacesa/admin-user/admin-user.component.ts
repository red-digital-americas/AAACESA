import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginServices } from '../../services/login.services';
import { BsComponentRef } from 'ngx-bootstrap/component-loader/bs-component-ref.class';
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';
import { UserData } from '../../models/user.models';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-admin-user',
  templateUrl: 'admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  providers: [LoginServices]
})
export class AdminUserComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'telefono', 'rfc', 'patente', 'perfil', 'activo', 'acciones'];
  dataSource = new MatTableDataSource();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public myModal;
  public detalle;
  modalRef: BsModalRef;
  modalCrea: BsModalRef;
  
  constructor(private http: Http, private modalService: BsModalService) {
    http.get('assets/user.json')
      .subscribe((data) => {
        setTimeout(() => {
          this.data = data.json();
          this.dataSource.data = data.json();
        }, 2000);
      });
   }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.numCuentas = this.userData.NumCuentas;
    console.log(this.numCuentas);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  detalleUSer(idCliente){
    this.modalRef = this.modalService.show(DetalleUserComponent,{
      initialState: {
        cveCliente: idCliente,
        title: "Detalle de Usuario",
      },
      class: 'modal-lg'
    });
    this.modalRef.content.closeBtnName = 'Close';
    
  }

  crearUser(){
    this.modalCrea = this.modalService.show(CrearUserComponent,{
      initialState: {
        title: "Alta de Usuario",
        idAdminUSer: this.userData.Autenticacion['IdCliente']
      },
      class: 'modal-lg'
    });
    this.modalCrea.content.closeBtnName = 'Close';
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

}
