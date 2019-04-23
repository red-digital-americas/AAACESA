import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-detalle-user',
  templateUrl: './detalle-user.component.html',
  styleUrls: ['./detalle-user.component.scss']
})
export class DetalleUserComponent implements OnInit {
  modalRef: BsModalRef| null;;
  constructor() { }

  ngOnInit() {
  }

  hide(){
    this.modalRef.hide();
  }

}
