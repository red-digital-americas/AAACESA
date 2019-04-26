import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginServices } from '../../services/login.services';
import { BsComponentRef } from 'ngx-bootstrap/component-loader/bs-component-ref.class';
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';
import { UserData } from '../../models/user.models';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

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
        this.dataSource.data = data.json();
      });
   }

  ngOnInit() {
    
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.numCuentas = this.userData.NumCuentas;

    this.dataSource.sort = this.sort;
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
}
