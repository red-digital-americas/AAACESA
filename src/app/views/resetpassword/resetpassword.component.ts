import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginServices } from '../../services/login.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'resetpassword.component.html',
  providers: [LoginServices]
})
export class ResetpasswordComponent implements OnInit {
  newPassword: string;
  guid: string;
  mail: string;
  idcliente:string;
  message: string;
  mostrar= false;
  validar= false;

  constructor(private route: ActivatedRoute, private loginservice: LoginServices) { }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
      console.log(params);
      this.idcliente = params['IdUser'];
      this.mail = params['Correo'];
      this.guid = params['token'];
    })
  }

  resetPassword(obj){
    this.validar= true;
    
      if(this.newPassword != undefined) 
      {
        this.loginservice.service_general_post('AAACESA-Portal/portalclientes/resetPassword',
          {"reset": {
              "idCliente": this.idcliente,
              "correo": this.mail,
              "guid": this.guid,
              "password": this.newPassword
          }}).subscribe((respuesta)=>{
            this.mostrar=true;
            if(respuesta.Result == "true")
            {
              this.message= "Contraseña cambiada correctamente, seras redirigido al login.";
              setTimeout(function(){
                window.location.href ="login";
              },3000);
            }
            else{
              this.message= "No se pudo cambiar la contraseña, enlace caducado.";
              setTimeout(function(){
                window.location.href ="login";
              },3000);
            }
        });
     }
  }
}
