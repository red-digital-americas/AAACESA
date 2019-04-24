import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss']
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

  constructor(public modalCrea: BsModalRef, private modalService: BsModalService) { }

  ngOnInit() {
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
