import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';
import { MatSort, MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { ApiServices } from '../../services/api.services';
import { UserData } from '../../models/user.models';

@Component({
  selector: 'app-admin-user',
  templateUrl: 'admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  providers: [ApiServices]
})
export class AdminUserComponent implements OnInit {

  displayedColumns: string[] = ['Nombre', 'Telefono', 'RFC', 'ClavePatente', 'ClavePerfil', 'IsBlocked', 'acciones'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public data;
  public userData;
  public numCuentas: boolean = false;
  public filterQuery = '';
  public myModal;
  public detalle;
  public rolUser : boolean = false;
  
  constructor(private http: Http, private apiserv: ApiServices, private dialog: MatDialog,public snackBar: MatSnackBar ) {
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
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
         rolAdmin: this.userData.Perfil['ClavePerfil'],
         patenteUser: this.userData.ClavePatente,
         rfcUser: this.userData.RFC,
         tipoUser: this.userData.TipoCliente,
         razonSocUser: this.userData.RazonSocial
       }
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
