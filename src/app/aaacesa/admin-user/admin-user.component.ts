import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginServices } from '../../services/login.services';
import { BsComponentRef } from 'ngx-bootstrap/component-loader/bs-component-ref.class';
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';
import { UserData } from '../../models/user.models';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-admin-user',
  templateUrl: 'admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  providers: [ApiServices]
})
export class AdminUserComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'telefono', 'rfc', 'patente', 'perfil', 'activo', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public data;
  public userData;
  public numCuentas: boolean = false;
  public filterQuery = '';
  public myModal;
  public detalle;
  public rolUser : boolean = false;
  modalRef: BsModalRef;
  modalCrea: BsModalRef;
  
  constructor(private http: Http, private modalService: BsModalService, private apiserv: ApiServices) {
   }

  ngOnInit() {
    
    this.userData = JSON.parse(localStorage.getItem("user"));

    if((this.userData.Perfil['ClavePerfil'] == "MAESTRO" ) || (this.userData.Perfil['ClavePerfil'] == "ADMIN") )
      this.rolUser = true;
    this.rolUser = this.userData.Perfil['ClavePerfil'];
    this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasDisponibles').subscribe((cuentas) => {
      if(cuentas > 0)
        this.numCuentas = true;
    });
    this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasAsociadas').subscribe((data) => {
      this.dataSource.data = data;
    });

   	  
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
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
        title: "Nuevo Usuario",
        idAdminUSer: this.userData.Id,
        patenteUser: "Patente: "+this.userData.ClavePatente,
        rfcUser: "RFC: "+this.userData.RFC
      },
      class: 'modal-lg'
    });
    this.modalCrea.content.closeBtnName = 'Close';
  }
}
