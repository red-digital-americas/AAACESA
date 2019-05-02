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
