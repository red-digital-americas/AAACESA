import { Component, OnInit } from '@angular/core';
import { LoginServices } from '../../services/login.services';
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers: [LoginServices, ApiServices],
})
export class LoginComponent implements OnInit {
  
  email: string="";
  recuperaEmail: string="";
  password: string="";
  getPasword = false;
  message: string="";
  validar = false;
  loginUser;
  sesionUser;

  constructor(private loginservice: LoginServices, private apiservices: ApiServices){};

  ngOnInit() {
    if (localStorage.getItem("user") != undefined) {
      window.location.href = "/";
    }
    
  }
  
  login(obj){  

    this.loginservice.service_general_login("/Authentication/Login",
        { 
          "Correo": this.email,
          "Password": this.password
        }
      ).subscribe((value) => {
        console.log(value);
        this.validar= true;
        localStorage.setItem('token', value.Token);
        if(value.isAuth)
        {
          this.apiservices.service_general_get("/AdministracionCuentas/GetCurrent").subscribe((respuesta)=>{
            console.log(respuesta);
            localStorage.setItem('user', JSON.stringify(respuesta));
            this.message = "Acceso correcto. Seras redirigido al Dashboard principal";
            setTimeout(function(){
              window.location.href ="dashboard";
            },3000);
          });
        }
        else{
          this.message = value.Detalle;
        }
      }
    );
  }

  onRecoveryPassword(){
    this.getPasword=true;
  }

  resetPassword(obj){
    this.validar= true;
    if(this.recuperaEmail != undefined)
    {
      this.apiservices.service_general_post("AAACESA-Portal/portalclientes/procesoRecupera", {
          "recu": {
            "correo": this.recuperaEmail
          }
        }).subscribe((value) => {
          this.message = value.Mensaje;
          if(value.Mensaje != "El usuario no existe")
          {
            this.message = "Se ha enviado un link al correo proporcionado. Seras redirigido al login";
            setTimeout(function(){
              window.location.href ="login";
            },3000);
          }
          
      });
    }
    else{
      this.message= "Es necesario ingresar un correo."
    }
  }
 
  limpiar(){
    this.email="";
    this.recuperaEmail="";
    this.password="";
    this.getPasword = false;
    this.message="";
    this.validar = false;
  }

}
