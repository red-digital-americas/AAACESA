import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StatusPipe } from './status.pipe';
import { DataFilterPipe } from './datafilterpipe';

import { MatDatepickerModule } from '@angular/material/datepicker';


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
// Modal
import { ModalModule } from 'ngx-bootstrap/modal';

// import { DataTableComponent } from './datatable.component';
import { AbandonoComponent } from './abandono.component';

// Routing
// import { DatatableRoutingModule } from './datatable-routing.module';
import { AbandonoRoutingModule } from './abandono-routing.module';

@NgModule({
  imports: [
    // DatatableRoutingModule,
    AbandonoRoutingModule,
    CommonModule,
    DataTableModule,
    FormsModule,
// tslint:disable-next-line: deprecation
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SelectModule,
    ModalModule
  ],
  declarations: [
    // DataTableComponent,
    AbandonoComponent,
    DataFilterPipe,
    StatusPipe
  ]
})
// export class DatatableInitModule { }
export class AbandonoModule { }
