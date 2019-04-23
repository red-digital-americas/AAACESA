import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginServices } from '../../services/login.services';
import { BsComponentRef } from 'ngx-bootstrap/component-loader/bs-component-ref.class';
import { DetalleUserComponent } from './detalle-user/detalle-user/detalle-user.component';

@Component({
  // selector: 'app-admin-user',
  templateUrl: 'admin-user.component.html',
  providers: [LoginServices]
})
export class AdminUserComponent implements OnInit {

  public data;
  public filterQuery = '';
  public myModal;
  public detalle;
  modalRef: BsModalRef;
  
  constructor(private http: Http, private modalService: BsModalService) {
    http.get('assets/user.json')
      .subscribe((data) => {
        setTimeout(() => {
          this.data = data.json();
        }, 2000);
      });
   }

  ngOnInit() {

  }
  detalleUSer(idCliente){
    console.log(idCliente);
    this.modalRef = this.modalService.show(DetalleUserComponent);
    
  }
  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

}
