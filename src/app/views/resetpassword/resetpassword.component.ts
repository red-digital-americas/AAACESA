import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { LoginServices } from '../../services/login.services';
import { HttpErrorResponse } from '@angular/common/http';

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
  hide = true;
  confPasw: string;
  loading:boolean=false;

  //Validar Passwords
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private route: ActivatedRoute, private loginservices: LoginServices,public snackBar: MatSnackBar, private fb: FormBuilder) {
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
      this.loading=true;
      this.route.queryParams.subscribe(params => {
      console.log(params);
      this.idcliente = params['IdUser'];
      this.mail = params['Correo'];
      this.guid = params['token'];
      this.loginservices.service_general_get_with_params('/PasswordRecovery/ValidaProcesoRecuperacion',{
        "Correo" : this.mail,
        "Guid" : this.guid,
        "IdCliente" : this.idcliente
      }).subscribe((respuesta)=>{
        this.loading=false;
          if(!respuesta)
          {
            this.sendAlert("El link a caducado, seras redirigido");
            setTimeout(function(){
              window.location.href ="login";
            },3000);
          }
      }, 
      (err: HttpErrorResponse) => { 
        this.loading=false;
        this.loading=false;
        this.sendAlert("El link a caducado, seras redirigido al login");
        setTimeout(function(){
          window.location.href ="login";
        },3000);
      });
    })
  }

  resetPassword(obj){
    this.loading= true;
    if(this.newPassword != undefined) 
    {
      this.loginservices.service_general_login('/PasswordRecovery/ResetPassword',
        {
          "Correo" : this.mail,
          "Guid" : this.guid,
          "IdCliente" : this.idcliente,
          "Password" : this.newPassword
        }).subscribe((respuesta)=>{
        if(respuesta)
        {
          this.loading= false;
          this.sendAlert("Contraseña cambiada correctamente, serás redirigido al login.");
          setTimeout(function(){
            window.location.href ="login";
          },3000);
        }
      }, 
      (err: HttpErrorResponse) => { 
        this.loading= false;
        if (err.error instanceof Error) {
          this.sendAlert('Error:'+ err.error.message);
        } else {
          let error= (err.error.Description == undefined)?err.error:err.error.Description;
          this.sendAlert(error);
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
