import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StatusPipe } from './status.pipe';

import { MatDatepickerModule } from '@angular/material/datepicker';

// import { DataTableComponent } from './datatable.component';
import { PrealertasComponent } from './prealertas.component';

// Routing
// import { DatatableRoutingModule } from './datatable-routing.module';
import { PrealertasRoutingModule } from './prealertas-routing.module';


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
// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [    
    PrealertasRoutingModule,
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
    CollapseModule.forRoot()
  ],
  declarations: [    
    PrealertasComponent,   
    StatusPipe 
  ]
})
export class PrealertasModule { }
