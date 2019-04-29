import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AbandonoComponent } from './abandono.component';

import { AbandonoRoutingModule } from './abandono-routing.module';
import { MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    AbandonoRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule
  ],
  declarations: [
    // DataTableComponent,
    AbandonoComponent,
  ]
})
// export class DatatableInitModule { }
export class AbandonoModule { }
