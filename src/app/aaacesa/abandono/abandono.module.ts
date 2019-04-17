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
    HttpModule
  ],
  declarations: [
    // DataTableComponent,
    AbandonoComponent,
    DataFilterPipe
  ]
})
// export class DatatableInitModule { }
export class AbandonoModule { }
