import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StatusPipe } from './status.pipe';

// import { DataTableComponent } from './datatable.component';
import { SalidasComponent } from './salidas.component';

// Routing
// import { DatatableRoutingModule } from './datatable-routing.module';
import { SalidasRoutingModule } from './salidas-routing.module';


//Material
import { MatInputModule } from '@angular/material/input';

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
    SalidasRoutingModule,
    CommonModule,
    DataTableModule,
    FormsModule,
    // tslint:disable-next-line: deprecation
    HttpModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SelectModule,
    ModalModule,
    MatInputModule
  ],
  declarations: [
    SalidasComponent,
    StatusPipe
  ]
})
export class SalidasModule { }
