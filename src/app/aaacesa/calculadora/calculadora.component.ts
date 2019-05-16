import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { FormBuilder, NgForm, FormGroup } from '@angular/forms';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatFormFieldControl } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-calculdora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
  './calculadora.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})

export class CalculadoraComponent implements OnInit {
  fechaPrevioSearch:Date = null;
  tyc =  false;
  frio = false;

  calculos = ['Almacenaje', 'Costo de congelación', 'Costo custodia', 'Costo maniobra'];
// tslint:disable-next-line: max-line-length
  calcfrios = ['Almacenaje', 'Manejo por valor', 'Maniobras', 'Refrigeración', 'Congelación', 'Temperatura controlada', 'Maniobras previo', 'Subtotal', 'IVA', 'Total'];

  options: FormGroup;

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
  }

}
