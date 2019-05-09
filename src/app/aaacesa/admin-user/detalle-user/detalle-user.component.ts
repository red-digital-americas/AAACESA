import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActualizaData, ActualizaPerfil } from '../../../models/user.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detalle-user',
  templateUrl: './detalle-user.component.html',
  styleUrls: ['./detalle-user.component.scss'],
  providers: [ApiServices]
})
export class DetalleUserComponent implements OnInit {
  disabled: boolean = false;
  disablePerfil:boolean=false;
  getPerfilUser:   string;
  mensaje: any;
  final: boolean = false;
  loading=false;
  title;

  public actualizaUser: ActualizaData= new ActualizaData();
  public actualizaPerfil: ActualizaPerfil= new ActualizaPerfil();

  public phoneModel = '';
  public phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  constructor(private apiservices: ApiServices, private dialogRef: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
  public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.title= this.data.title;
    this.loading=true;
    this.actualizaUser.Telefono= "";
     this.apiservices.service_general_get("/AdministracionCuentas/GetAccountById/"+this.data.cveCliente).subscribe((res)=>{
      this.loading=false;
      this.actualizaUser.Id= this.data.cveCliente;
      this.actualizaPerfil.Id= this.data.cveCliente;
      this.actualizaUser.Nombre= res.Nombre;
      this.actualizaUser.Paterno= res.Paterno;
      this.actualizaUser.Materno= res.Materno;
      this.actualizaUser.Correo= res.Correo;
      this.actualizaUser.Telefono= res.Telefono;
      this.actualizaUser.Perfil.ClavePerfil= res.Perfil['ClavePerfil'];
      this.actualizaPerfil.Perfil.ClavePerfil= res.Perfil['ClavePerfil'];
    });
    this.apiservices.service_general_get("/Catalogos/GetPerfiles").subscribe((res)=>{
      this.getPerfilUser = res;
    });
  }

  actualiza() {
    this.loading=true;
    this.actualizaUser.Telefono =  this.actualizaUser.Telefono.replace(/\D+/g, '');
    this.final = true;
    this.apiservices.service_general_put("/AdministracionCuentas/UpdateCliente",this.actualizaUser).subscribe((res)=>{
      this.loading=false;
      this.mensaje = res.Description;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      console.log(err.error);
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });

    this.apiservices.service_general_put("/AdministracionCuentas/UpdatePerfilCliente",this.actualizaPerfil).subscribe((res)=>{
      this.mensaje = res.Description;
    }, 
    (err: HttpErrorResponse) => { 
      console.log(err.error);
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });
    
  }

  edit() {
    this.title= "Actualizar datos del Usuario";
    this.disabled=true;
    this.disablePerfil= this.data.tipoPerfil;
  }

  validar_campos(event) {
    for (var i = 0; i < event.length; i++) {
      console.log(event[i].name);
      if (!event[i].valid) {
        $("#" + event[i].name).focus();
        break;
      }
    }
    this.sendAlert("Algunos campos necesitan ser revisados");
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}
