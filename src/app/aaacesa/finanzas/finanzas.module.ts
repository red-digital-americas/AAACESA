import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FinanzasComponent } from './finanzas.component';

//import { FinanzasRoutingModule } from './finanzas-routing.module';
import { MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatInputModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FinanzasRoutingModule } from './finanzas-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FinanzasRoutingModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
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
