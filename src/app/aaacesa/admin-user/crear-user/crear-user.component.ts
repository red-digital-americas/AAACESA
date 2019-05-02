import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss'],
  providers: [ApiServices]
})
export class CrearUserComponent implements OnInit {

  nombreUser:   string;
  aPaternoUser: string;
  aMaternoUser: string;
  telUser:      string;
  rfcUser:      string = this.data.rfcUser;
  patenteUser:  string = this.data.patenteUser;
  razonSocUser:  string = this.data.razonSocUser;
  perfilUser:   string;
  getPerfilUser:   string;
  mailUser:     string;
  fotoUser:     string;
  tipoUser:     string = this.data.tipoUser;
  numCuentUser: string="";
  idAdminUSer;

  constructor(private apiservices: ApiServices,private dialogRef: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.apiservices.service_general_get("/Catalogos/GetPerfiles").subscribe((res)=>{
      this.getPerfilUser = res;
    });
  }

  guardaUsuario(obj) {
    console.log(this.data.patenteUser);
    this.apiservices.service_general_post("/AdministracionCuentas/CrearCuenta",
      {
        "ClavePatente" : this.data.patenteUser,
        "TipoCliente" : this.data.tipoUser,
        "RazonSocial" : this.data.razonSocUser,
        "RFC" : this.data.rfcUser,
        "NumCuentas" : this.numCuentUser,
        "Correo" : this.mailUser,
        "Nombre" : this.nombreUser,
        "Paterno" : this.aPaternoUser,
        "Materno" : this.aMaternoUser,
        "Telefono" : this.telUser,
        "Perfil" : {
          "ClavePerfil" : this.perfilUser
        }
      }
    ).subscribe((value) => {
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

  login(obj){
    console.log("Creado");
  }

}
