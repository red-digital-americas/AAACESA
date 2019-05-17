import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalculadoraComponent } from './calculadora.component';

import { CalculadoraRoutingModule } from './calculadora-routing.module';
// tslint:disable-next-line: max-line-length
import { MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatSnackBarModule, MatExpansionModule, MatAutocompleteModule, MatRadioModule } from '@angular/material';
import { NgxLoadingModule } from 'ngx-loading';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ngfModule } from 'angular-file';

@NgModule({
  imports: [
    CalculadoraRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    BsDatepickerModule.forRoot(),
    SelectModule,
    MatExpansionModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelectModule,    
    MatSnackBarModule,  
    MatRadioModule,
    NgxMatSelectSearchModule,
    ngfModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    CalculadoraComponent,
  ],
  exports:[
    CalculadoraComponent
  ]
})

export class CalculadoraModule { }
