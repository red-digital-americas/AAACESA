import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginServices } from '../../services/login.services';
import { BsComponentRef } from 'ngx-bootstrap/component-loader/bs-component-ref.class';
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';
import { UserData } from '../../models/user.models';
@Component({
  // selector: 'app-admin-user',
  templateUrl: 'admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  providers: [LoginServices]
})
export class AdminUserComponent implements OnInit {

  public data;
  public userData;
  public numCuentas;
  public filterQuery = '';
  public myModal;
  public detalle;
  modalRef: BsModalRef;
  modalCrea: BsModalRef;
  
  constructor(private http: Http, private modalService: BsModalService) {
    http.get('assets/user.json')
      .subscribe((data) => {
        setTimeout(() => {
          this.data = data.json();
        }, 2000);
      });
   }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.numCuentas = this.userData.NumCuentas;
    console.log(this.numCuentas);
  }
  detalleUSer(idCliente){
    this.modalRef = this.modalService.show(DetalleUserComponent,{
      initialState: {
        cveCliente: idCliente,
        title: "Detalle de Usuario",
      }
    });
    this.modalRef.content.closeBtnName = 'Close';
    
  }

  crearUser(){
    this.modalCrea = this.modalService.show(CrearUserComponent,{
      initialState: {
        title: "Alta de Usuario",
      }
    });
    this.modalCrea.content.closeBtnName = 'Close';
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

}
