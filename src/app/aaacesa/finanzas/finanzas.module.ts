import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FinanzasComponent } from './finanzas.component';

//import { FinanzasRoutingModule } from './finanzas-routing.module';
import { MatTabsModule, MatSortModule, MatIconModule, MatInputModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FinanzasRoutingModule } from './finanzas-routing.module';

import { BsDatepickerModule } from 'ngx-bootstrap';



@NgModule({
  imports: [
    CommonModule,
    FinanzasRoutingModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
    BsDatepickerModule.forRoot(),
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    SharedModule
  ],
  declarations: [
    FinanzasComponent,
  ]
})
export class FinanzasModule { }
