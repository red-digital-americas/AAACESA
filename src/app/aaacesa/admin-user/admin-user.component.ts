import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';
import { MatSort, MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
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
  
  constructor(private http: Http, private modalService: BsModalService, private apiserv: ApiServices, private dialog: MatDialog,public snackBar: MatSnackBar ) {
   }

  ngOnInit() {
    
    this.userData = JSON.parse(localStorage.getItem("user"));

    if((this.userData.Perfil['ClavePerfil'] == "MAESTRO" ) || (this.userData.Perfil['ClavePerfil'] == "ADMIN") )
      this.rolUser = true;
    
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

  changed(evt, IdCliente){

    if(evt.target.checked)
    {
      this.apiserv.service_general_put('/AdministracionCuentas/DesbloquearCuenta',IdCliente).subscribe((data) => {
        this.sendAlert("La cuenta se desbloqueó correctamente");
      });
    }
    else{
      this.apiserv.service_general_put('/AdministracionCuentas/BloquearCuenta',IdCliente).subscribe((data) => {
        this.sendAlert("La cuenta se bloqueó correctamente");
      });
    }
  }

  detalleUSer(idCliente){
    const dialogRef = this.dialog.open(DetalleUserComponent, {
      width: '95%',
      data: { 
        cveCliente: idCliente,
         title: "Detalle de Usuario"
       }
    });
  }

  crearUser(){
    const dialogRef = this.dialog.open(CrearUserComponent,{
      width: '95%',
       data: {
        rolAdmin: this.userData.Perfil,
         patenteUser: this.userData.ClavePatente,
         rfcUser: this.userData.RFC,
         tipoUser: this.userData.TipoCliente,
         razonSocUser: this.userData.RazonSocial
       }
      // data: {
      //   rolAdmin: "ADMIN",
      //   patenteUser: 3781,
      //   rfcUser: "XXXXXXXXXX",
      //   tipoUser:  "AA",
      //   razonSocUser: "VICENTE RIVERA RAMOS"
      // }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.sendAlert("La tabla se actualizó");
      this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasAsociadas').subscribe((data) => {
        this.dataSource.data = data;
      });     
    });
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
