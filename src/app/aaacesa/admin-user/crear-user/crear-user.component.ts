import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoginServices } from '../../../services/login.services';
import { ApiServices } from '../../../services/api.services';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss'],
  providers: [LoginServices, ApiServices]
})
export class CrearUserComponent implements OnInit {

  nombreUser:   string;
  aPaternoUser: string;
  aMaternoUser: string;
  telUser:      string;
  rfcUser:      string;
  patenteUser:  string;
  perfilUser:   string;
  getPerfilUser:   string;
  mailUser:     string;
  fotoUser:     string;
  modalCrea2:   BsModalRef;
  title:        string;
  idAdminUSer;

  constructor(public modalCrea: BsModalRef, private modalService: BsModalService, private apiservices: ApiServices) { }

  ngOnInit() {
    this.apiservices.service_general_get("/Catalogos/GetPerfiles").subscribe((res)=>{
      console.log(res)
      this.getPerfilUser = res;
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
