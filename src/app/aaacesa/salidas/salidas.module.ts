import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SalidasComponent, DialogCreateSalidaComponent} from './salidas.component';
import { SalidasRoutingModule } from './salidas-routing.module';

//Material
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog'
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

//Vendor
import { BsDatepickerModule } from 'ngx-bootstrap';                   // Datepicker
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';     // Select Search Mat

// Shared
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SalidasComponent,
    DialogCreateSalidaComponent
  ],
  entryComponents: [
    DialogCreateSalidaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    SalidasRoutingModule,
    MatDialogModule,
    MatStepperModule,
    BsDatepickerModule.forRoot(),
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatSnackBarModule,
    SharedModule
  ]
})
export class SalidasModule { }
