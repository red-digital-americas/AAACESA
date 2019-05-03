import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { UserData } from '../../../models/user.models';
import { AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss'],
  providers: [ApiServices]
})
export class CrearUserComponent implements OnInit {
  //Perfil Admin
  rolAdminUSer:string=this.data.rolAdmin;
  visible: boolean=false;
  rfcVisible:boolean=false;
  RFCcliente;
  getRFCcliente;
  //Crear Usuario
  getPerfilUser:   string;
  final: boolean=false;
  mensaje="";
  public rfcCliente:string;
  public crearUser: UserData= new UserData();

  public phoneModel = '';
  public phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  constructor(private apiservices: ApiServices,private dialogRef: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.crearUser.RFC = this.data.rfcUser;
    this.crearUser.RazonSocial = this.data.razonSocUser;
    this.crearUser.ClavePatente = this.data.patenteUser;
    this.crearUser.TipoCliente = this.data.tipoUser;
    
    this.visible=(this.rolAdminUSer=='ADMIN')?true:false;
    this.apiservices.service_general_get("/Catalogos/GetPerfiles").subscribe((res)=>{
      this.getPerfilUser = res;
    });
  }

  crearUserByAdmin(){
    
  }

  buscaRFCUsuario(){
    console.log(this.rfcCliente);
    this.rfcVisible=true;
    // this.apiservices.service_general_get("/Catalogos/GetClientes"+this.rfcCliente).subscribe((res)=>{
    //   console.log(res);
    //   this.getRFCcliente  = res;
    // });
  }

  guardaUsuario() {
    this.crearUser.Telefono =  this.crearUser.Telefono.replace(/\D+/g, '');
    this.apiservices.service_general_post("/AdministracionCuentas/CrearCuenta", this.crearUser ).subscribe((value) => {
        this.final= (value.Result)?true:false;
        this.mensaje = value.Description
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
