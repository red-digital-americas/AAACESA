import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { AaacesaSalidasComponent } from './aaacesa-salidas.component';
import { AaacesaSalidasRoutingModule } from './aaacesa-salidas-routing.module';

import { GeneralTableComponent } from '../../aaacesa/general-table/general-table.component'

// DataTable
import { DataTableModule } from 'angular2-datatable';
// Angular 2 Input Mask
import { TextMaskModule } from 'angular2-text-mask';
// Timepicker
import { TimepickerModule } from 'ngx-bootstrap';
// Datepicker
import { BsDatepickerModule } from 'ngx-bootstrap';
// Ng2-select
import { SelectModule } from 'ng-select';
//Modal
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    AaacesaSalidasRoutingModule,
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SelectModule,
    ModalModule
  ],
  declarations: [
    AaacesaSalidasComponent,
    GeneralTableComponent
  ]
})
export class AaacesaSalidasModule {

}
