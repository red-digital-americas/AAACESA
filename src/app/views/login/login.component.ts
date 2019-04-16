import { Component, OnInit } from '@angular/core';
import { LoginServices } from '../../services/login.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers: [LoginServices]
})
export class LoginComponent implements OnInit {

  email: string;
  recuperaEmail: string;
  password: string;
  getPasword = false;
  message: string;
  validar= false;
  loginUser;
  sesionUser;

  constructor(private loginservice: LoginServices){};

  ngOnInit() {
  }
  
  login(obj){  
    if((this.email != undefined) && (this.password != undefined))
    {
      this.loginUser = this.loginservice.loginAuth(this.email,this.password);
      switch(this.loginUser["CveEstatus"]){
        case "A": 
          this.message = "Acceso Correcto";
          this.validar= true;
          this.sesionUser =this.loginservice.getDetalleUser(this.loginUser["IdCliente"]);
            localStorage.setItem("IdCliente",  this.sesionUser["IdCliente"]);
            localStorage.setItem("Nombre",  this.sesionUser["Nombre"]+" "+this.sesionUser["Paterno"]+" "+this.sesionUser["Materno"]);
            localStorage.setItem("CvePerfil",  this.sesionUser["CvePerfil"]);
            localStorage.setItem("TipoCliente",  this.sesionUser["TipoCliente"]);
            localStorage.setItem("RazonSocial",  this.sesionUser["RazonSocial"]);
            localStorage.setItem("ClavePatente",  this.sesionUser["ClavePatente"]);
            localStorage.setItem("NumCuentas",  this.sesionUser["NumCuentas"]);
            localStorage.setItem("isAuth",  "SI");
            localStorage.setItem("avatar",  this.sesionUser["GetFotoPerfil"]);
            window.location.href = "dashboard";
          break;
        case "B": 
          this.message = this.loginUser["Detalle"]+". Favor de validar con el administrador del sistema";
          this.validar= true;
          break;
        case null: 
          this.message = this.loginUser["Detalle"];
          this.validar= true;
          break;
        default: this.message ="Error";
          break;
      }
    }
    else{
      this.message= "Valores incorrectos"
      this.validar= true;
    }
  }

  onRecoveryPassword(){
    this.getPasword=true;
  }

  resetPassword(obj){
    this.validar= true;
    if(this.recuperaEmail != undefined)
    {
      this.message= "Se ha enviado un correo para completar el proceso."
      setTimeout(function(){
        window.location.href ="reset";
      },3000);
    }
    else{
      this.message= "Es necesario ingresar un correo."
    }
  }
 
}
