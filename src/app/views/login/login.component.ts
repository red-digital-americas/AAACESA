import { Component, OnInit } from '@angular/core';
import { LoginServices } from '../../services/login.services';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers: [LoginServices]
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

  constructor(private loginservice: LoginServices){};

  ngOnInit() {
  }
  
  login(obj){  
    
      this.loginservice.service_general("AAACESA-Portal/portalclientes/autentificacionUsuario",
          { "itemautenticacion": {
            "Correo": this.email,
            "Password": this.password
          }
      }).subscribe((value) => {
          this.validar= true;
          if(value.isAuth)
          {
            this.loginservice.getJSON("assets/user.json").subscribe((response)=>{
              console.log(response);
              localStorage.setItem('user', JSON.stringify(response));
              this.message = "Acceso correcto. Seras redirigido al Dashboard principal";
                setTimeout(function(){
                window.location.href ="dashboard";
             },3000);
            })
            // this.loginservice.service_general("AAACESA-Portal/portalclientes/",{}).subscribe((respuesta)=>{
            //   sessionStorage.setItem('user', JSON.stringify(respuesta));
            // });

            
          }
          else{
            this.message = value.Detalle;
          }
          
      });
      // switch(this.loginUser["CveEstatus"]){
      //   case "A": 
      //     this.message = "Acceso Correcto";
      //     this.validar= true;
      //     this.sesionUser =this.loginservice.getDetalleUser(this.loginUser["IdCliente"]);
      //       localStorage.setItem("IdCliente",  this.sesionUser["IdCliente"]);
      //       localStorage.setItem("Nombre",  this.sesionUser["Nombre"]+" "+this.sesionUser["Paterno"]+" "+this.sesionUser["Materno"]);
      //       localStorage.setItem("CvePerfil",  this.sesionUser["CvePerfil"]);
      //       localStorage.setItem("TipoCliente",  this.sesionUser["TipoCliente"]);
      //       localStorage.setItem("RazonSocial",  this.sesionUser["RazonSocial"]);
      //       localStorage.setItem("ClavePatente",  this.sesionUser["ClavePatente"]);
      //       localStorage.setItem("NumCuentas",  this.sesionUser["NumCuentas"]);
      //       localStorage.setItem("isAuth",  "SI");
      //       localStorage.setItem("avatar",  this.sesionUser["GetFotoPerfil"]);
      //       window.location.href = "dashboard";
      //     break;
      //   case "B": 
      //     this.message = this.loginUser["Detalle"]+". Favor de validar con el administrador del sistema";
      //     this.validar= true;
      //     break;
      //   case null: 
      //     this.message = this.loginUser["Detalle"];
      //     this.validar= true;
      //     break;
      //   default: this.message ="Error";
      //     break;
      // }
  }

  onRecoveryPassword(){
    this.getPasword=true;
  }

  resetPassword(obj){
    this.validar= true;
    if(this.recuperaEmail != undefined)
    {
      this.loginservice.service_general("AAACESA-Portal/portalclientes/procesoRecupera", {
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
