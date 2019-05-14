import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitacorasRoutingModule } from './bitacoras-routing.module';
import { BitacorasComponent } from './bitacoras.component';
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatIconModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BitacorasRoutingModule,
    DataTableModule,
    FormsModule,
    HttpModule,
    SelectModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule, 
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    SharedModule,
    NgxLoadingModule.forRoot({}),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [BitacorasComponent]
})
export class BitacorasModule { }
