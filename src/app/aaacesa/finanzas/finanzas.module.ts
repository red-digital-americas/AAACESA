import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FinanzasComponent } from './finanzas.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

//import { FinanzasRoutingModule } from './finanzas-routing.module';
import { MatTabsModule, MatSortModule, MatIconModule, MatInputModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatSnackBarModule, MatCardModule, MatDividerModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FinanzasRoutingModule } from './finanzas-routing.module';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { TextMaskModule } from 'angular2-text-mask';



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
    MatCardModule,
    TextMaskModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
    SharedModule,
    MatDividerModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    FinanzasComponent,
  ]
})
export class FinanzasModule { }
