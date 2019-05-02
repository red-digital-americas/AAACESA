import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalculadoraComponent } from './calculadora.component';

import { CalculadoraRoutingModule } from './calculadora-routing.module';
// tslint:disable-next-line: max-line-length
import { MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CalculadoraRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  declarations: [
    CalculadoraComponent,
  ]
})

export class CalculadoraModule { }
