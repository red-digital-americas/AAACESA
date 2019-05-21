import { Component, OnInit } from '@angular/core';
import { LoginServices } from '../../services/login.services';
import { ApiServices } from '../../services/api.services';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers: [LoginServices, ApiServices],
})
export class LoginComponent implements OnInit {
  loading:boolean=false;
  email: string="";
  recuperaEmail: string="";
  password: string="";
  getPasword = false;
  message: string="";
  validar = false;
  hide = true;
  checked: boolean=false;
  loginUser;
  sesionUser;

  constructor(private loginservice: LoginServices, private apiservices: ApiServices, public snackBar: MatSnackBar){};

  ngOnInit() {
    if (localStorage.getItem("user") != undefined) {
      window.location.href = "/";
    }
    
  }
  
  login(obj){ 
    this.loading= true; 
    this.loginservice.service_general_login("/Authentication/Login",
        { 
          "Correo": this.email,
          "Password": this.password
        }
      ).subscribe((value) => {
        localStorage.setItem('token', value.Token);
        localStorage.setItem('refreshToken', value.RefreshToken);
        if(value.isAuth)
        {
          this.apiservices.service_general_get("/AdministracionCuentas/GetCurrent").subscribe((respuesta)=>{
            let myDate = new Date();
            localStorage.setItem('user', JSON.stringify(respuesta));
            localStorage.setItem('rol', JSON.stringify(respuesta.Perfil.ClavePerfil));
            localStorage.setItem("mytime", myDate.toString());
            
     localStorage.setItem("clk","0")
      
     localStorage.setItem("prevclick","0")
      
     localStorage.setItem("salidasclick","0")
      
     localStorage.setItem("exportclick","0")
     
     localStorage.setItem("finclick","0")
      
     localStorage.setItem("mercaclick","0")
      
     localStorage.setItem("abanclick","0")
     
            this.loading = false;
            this.message = "Acceso correcto. Seras redirigido al Dashboard principal";
            this.sendAlert(this.message);
            setTimeout(function(){
              window.location.href ="dashboard";
            },3000);
          }, 
          (err: HttpErrorResponse) => { 
            this.loading=false;
            if (err.error instanceof Error) {
              this.sendAlert('Error:'+ err.error.message);
            } else {
              let error= (err.error.Description == undefined)?err.error:err.error.Description;
              this.sendAlert(error);
            }
          });
        }
        else{
          this.loading = false;
          this.message = value.Detalle;
          this.sendAlert(this.message);
        }
      });
  }
  
  validar_campos(event) {
    for (var i = 0; i < event.length; i++) {
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
  
  onRecoveryPassword(){
    this.getPasword=true;
  }

  resetPassword(obj){
    this.loading= true;
    if(this.recuperaEmail != undefined)
    {
      this.loginservice.service_general_put("/PasswordRecovery/ProcesoRecuperacion", "'"+this.recuperaEmail+"'").subscribe((value) => {
        this.message = value;
        if(value != "El usuario no existe")
        {
          this.loading= false;
          this.message;
          this.sendAlert(this.message);
          setTimeout(function(){
            window.location.href ="login";
          },3000);
        }
      }, 
      (err: HttpErrorResponse) => { 
        this.loading=false;
        if (err.error instanceof Error) {
          this.sendAlert('Error:'+ err.error.message);
        } else {
          let error= (err.error.Description == undefined)?err.error:err.error.Description;
          this.sendAlert(error);
        }
      });
    }
    else{
      this.loading= false;
      this.message
      this.sendAlert(this.message);
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
