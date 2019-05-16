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

  displayedColumns: string[] = ['Nombre', 'Telefono', 'ClavePatente' , 'Correo', 'ClavePerfil', 'IsBlocked', 'acciones'];
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
  changeToggle;
  loading=false;
  
  constructor(private http: Http, private apiserv: ApiServices, private dialog: MatDialog,public snackBar: MatSnackBar ) {
   }

  ngOnInit() {
    this.loading=true;
    this.userData = JSON.parse(localStorage.getItem("user"));

    if((this.userData.Perfil['ClavePerfil'] == "MAESTRO" ) || (this.userData.Perfil['ClavePerfil'] == "ADMIN") )
      this.rolUser = true;
    
    this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasDisponibles').subscribe((cuentas) => {
      if(cuentas > 0)
        this.numCuentas = true;
    });

    this.getCuentasAsocUser()
    
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  changed(event, IdCliente){
    this.loading=true;
    if(event.checked)
    {
      this.apiserv.service_general_put('/AdministracionCuentas/DesbloquearCuenta',IdCliente).subscribe((data) => {
        this.loading=false;
        this.sendAlert("La cuenta se desbloqueó correctamente");
      });
    }
    else{
      this.apiserv.service_general_put('/AdministracionCuentas/BloquearCuenta',IdCliente).subscribe((data) => {
        this.loading=false;
        this.sendAlert("La cuenta se bloqueó correctamente");
      });
    }
  }

  detalleUSer(idCliente){
    const dialogRef = this.dialog.open(DetalleUserComponent, {
      width: '95%',
      data: { 
        cveCliente: idCliente,
        title: "Detalle de Usuario",
        tipoPerfil: this.rolUser
       }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.sendAlert("La tabla se actualizó correctamente");
      this.getCuentasAsocUser();    
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
      this.getCuentasAsocUser();
    });
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  getCuentasAsocUser(){
    this.apiserv.service_general_get('/AdministracionCuentas/GetCuentasAsociadas').subscribe((data) => {
      this.loading=false;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {      
        switch (property) {     
          case 'ClavePerfil': {   
            let dato = item['Perfil']['ClavePerfil'];   
            return dato;
            }
          default: { return item[property];} 
        }
      };
    });
  }

}
