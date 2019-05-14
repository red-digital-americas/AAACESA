import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServices } from '../../services/api.services';
import { Http } from '@angular/http';
import { MatTabChangeEvent } from '@angular/material';
import { MercanciasBusqueda } from '../../models/bitacoras.model';

@Component({
  selector: 'app-mercancias',
  templateUrl: './mercancias.component.html',
  providers: [ApiServices]
})
export class MercanciasComponent implements OnInit {

  loading = false;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  busquedaModel: MercanciasBusqueda = new MercanciasBusqueda();

  @ViewChild('tabGroup') tabGroup;

  constructor(private http: Http, private apiserv: ApiServices) { }

  ngOnInit() {
  }

  buscarMercancias(){
  }
  limpiarFlitros(){
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {}

}
