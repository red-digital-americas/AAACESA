import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

//////////////////////////
// Vendors Components
import { DataTableModule } from 'angular2-datatable';                 // DataTable
import { TextMaskModule } from 'angular2-text-mask';                  // Angular 2 Input Mask
import { TimepickerModule } from 'ngx-bootstrap';                     // Timepicker
import { BsDatepickerModule } from 'ngx-bootstrap';                   // Datepicker
import { SelectModule } from 'ng-select';                             // Ng2-select
import { ModalModule } from 'ngx-bootstrap/modal';                    // Modal
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';     // Select Search Mat
import { ngfModule } from 'angular-file';
import { NgxLoadingModule } from 'ngx-loading';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

// Material
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


/////////////////////
// Components
import { PreviosComponent, DialogCreatePreviosComponent } from './previos.component';

////////////////
// Routing
import { PreviosRoutingModule } from './previos-routing.module';

////////////////
// Shared
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    PreviosRoutingModule,
    CommonModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),          
    SelectModule,
    ModalModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    ngfModule,
    NgxLoadingModule.forRoot({}),
    PdfJsViewerModule,
    SharedModule
  ],
  declarations: [
    PreviosComponent,
    DialogCreatePreviosComponent
  ],
  entryComponents: [
    DialogCreatePreviosComponent
  ]
})
export class PreviosModule { }
