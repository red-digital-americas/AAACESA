import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoginServices } from '../../../services/login.services';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss'],
  providers: [LoginServices]
})
export class CrearUserComponent implements OnInit {

  nombreUser:   string;
  aPaternoUser: string;
  aMaternoUser: string;
  telUser:      string;
  rfcUser:      string="RFC: EAYF890312MJ7";
  patenteUser:  string ="Patente: 31134";
  perfilUser:   string;
  mailUser:     string;
  fotoUser:     string;
  modalCrea2:   BsModalRef;
  title:        string;
  idAdminUSer;

  constructor(public modalCrea: BsModalRef, private modalService: BsModalService, private loginservice: LoginServices) { }

  ngOnInit() {
    this.loginservice.service_general("AAACESA-Portal/portalclientes/getperfil",{
      "getperfiles": {
        "idCliente": this.idAdminUSer
    }
    }).subscribe((res)=>{
      this.perfilUser = res;
    });
  }

  guardaUsuario(template: TemplateRef<any>) {
    this.modalCrea2 = this.modalService.show(template, { class: 'second' });
    this.modalCrea.hide();
    this.modalCrea = null;
  }

  login(obj){
    console.log("Creado");
  }

}
