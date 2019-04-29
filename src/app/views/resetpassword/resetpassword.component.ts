import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-resetpassword',
  templateUrl: 'resetpassword.component.html',
  providers: [ApiServices]
})
export class ResetpasswordComponent implements OnInit {
  newPassword: string;
  guid: string;
  mail: string;
  idcliente:string;
  message: string;
  mostrar= false;
  validar= false;

  constructor(private route: ActivatedRoute, private apiservices: ApiServices) { }

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
        this.apiservices.service_general_post('AAACESA-Portal/portalclientes/resetPassword',
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
