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
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select'; 
import { MatStepperModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio'; 

//Vendor
import { BsDatepickerModule } from 'ngx-bootstrap';       // Datepicker
import { ModalModule } from 'ngx-bootstrap/modal';        //Modal
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';     // Select Search Mat
import { ngfModule } from 'angular-file';
import { NgxLoadingModule } from 'ngx-loading';

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
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatRadioModule,
    ModalModule,
    BsDatepickerModule.forRoot(),
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatSnackBarModule,
    ngfModule,
    NgxLoadingModule.forRoot({}),
    SharedModule
  ]
})
export class SalidasModule { }
