import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServices } from '../../services/api.services';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-dashboard',
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
  hide = true;
  confPasw: string;

  //Validar Passwords
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private route: ActivatedRoute, private apiservices: ApiServices,public snackBar: MatSnackBar, private fb: FormBuilder) {
    this.form = this.fb.group({
      passwordUser: ['', [Validators.required]],
      passwConfirm: ['',[Validators.required]]
    }, { validator: this.checkPasswords });
   }

   checkPasswords(group: FormGroup) { 
   let pass = group.controls.passwordUser.value;
   let confirmPass = group.controls.passwConfirm.value;

   return pass === confirmPass ? null : { notSame: true }
 }

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


  validar_campos(event?) {
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
