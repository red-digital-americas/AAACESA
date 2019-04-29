import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StatusPipe } from './status.pipe';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';


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
import { PreviosComponent } from './previos.component';

// Acocordion
import {MatExpansionModule} from '@angular/material/expansion';

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
    SelectModule,
    ModalModule,
    MatExpansionModule,
    MatFormFieldModule
  ],
  declarations: [
    PreviosComponent,
    StatusPipe
  ]
})
export class PreviosModule { }
