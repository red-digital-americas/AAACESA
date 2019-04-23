// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: []
// })
// export class AbandonoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { DataFilterPipe } from './datafilterpipe';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Angular 2 Input Mask
import { TextMaskModule } from 'angular2-text-mask';

// Timepicker & Paginator
import { TimepickerModule, PaginationModule, PopoverModule } from 'ngx-bootstrap';

// Datepicker
import { BsDatepickerModule } from 'ngx-bootstrap';

// Ng2-select
import { SelectModule } from 'ng-select';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

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
    BsDropdownModule.forRoot(),
    FormsModule,
// tslint:disable-next-line: deprecation
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    SelectModule
  ],
  declarations: [
    // DataTableComponent,
    AbandonoComponent,
    DataFilterPipe
  ]
})
// export class DatatableInitModule { }
export class AbandonoModule { }
