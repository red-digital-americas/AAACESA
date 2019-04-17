import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resetpassword',
  templateUrl: 'resetpassword.component.html',
})
export class ResetpasswordComponent implements OnInit {
  newPassword1: string;
  newPassword2: string;
  message: string;
  mostrar= false;
  validar= false;

  constructor() { }

  ngOnInit() {
  }

  resetPassword(obj){
    this.validar= true;
    
      if((this.newPassword1 != undefined) && (this.newPassword2 != undefined)) 
      {
        
        if(this.newPassword1 != this.newPassword2) 
        {
          this.mostrar=false;
          this.message= "Las contraseñas son diferentes, intentar de nuevo.";
        }
        else{
          this.mostrar=true;
          this.message= "Contraseña cambiada correctamente, seras redirigido al login.";
          setTimeout(function(){
            window.location.href ="login";
          },3000);
        }
     }
     else{
      this.mostrar=false;
      this.message= "Debes completar ambos campos.";
     }
    
  }

}
