import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { UserData } from '../../../models/user.models';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss'],
  providers: [ApiServices]
})
export class CrearUserComponent implements OnInit {

  getPerfilUser:   string;
  idAdminUSer;
  public crearUser: UserData= new UserData();

  constructor(private apiservices: ApiServices,private dialogRef: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.crearUser.RFC = this.data.rfcUser;
    this.crearUser.RazonSocial = this.data.razonSocUser;
    this.crearUser.ClavePatente = this.data.patenteUser;
    this.crearUser.TipoCliente = this.data.tipoUser;
    this.apiservices.service_general_get("/Catalogos/GetPerfiles").subscribe((res)=>{
      this.getPerfilUser = res;
    });
  }

  guardaUsuario() {
    console.log(this.crearUser);
    this.apiservices.service_general_post("/AdministracionCuentas/CrearCuenta", this.crearUser ).subscribe((value) => {
      console.log(value);
    }, 
    (err: HttpErrorResponse) => { 
      console.log(err.error);
      if (err.error instanceof Error) {
        console.error('An error occurred:', err.error.message);
      } else {
        console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }

  validar_campos(event) {
    for (var i = 0; i < event.length; i++) {
      console.log(event[i].name);
      if (!event[i].valid) {
        $("#" + event[i].name).focus();
        break;
      }
    }
    this.snackBar.open("Algunos campos necesitan ser revisados", "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}
