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

// Timepicker
import { TimepickerModule } from 'ngx-bootstrap';

// Datepicker
import { BsDatepickerModule } from 'ngx-bootstrap';

// Ng2-select
import { SelectModule } from 'ng-select';

import { PreviosComponent } from './previos.component';

import { PreviosRoutingModule } from './previos-routing.module';

@NgModule({
  imports: [
    PreviosRoutingModule,
    CommonModule,
    DataTableModule,
    FormsModule,
// tslint:disable-next-line: deprecation
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SelectModule
  ],
  declarations: [
    PreviosComponent,
    DataFilterPipe
  ]
})
export class PreviosModule { }
