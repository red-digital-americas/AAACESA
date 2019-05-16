import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FinanzasComponent } from './finanzas.component';

//import { FinanzasRoutingModule } from './finanzas-routing.module';
import { MatTabsModule, MatSortModule, MatIconModule, MatInputModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatSnackBarModule, MatCardModule, MatDividerModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FinanzasRoutingModule } from './finanzas-routing.module';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';



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
