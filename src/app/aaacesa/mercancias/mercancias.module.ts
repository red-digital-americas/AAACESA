import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MercanciasRoutingModule } from './mercancias-routing.module';
import { MercanciasComponent } from './mercancias.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDatepickerModule, MatInputModule, MatTabsModule, MatIconModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxLoadingComponent, NgxLoadingModule } from 'ngx-loading';
import { DataTableModule } from 'angular2-datatable';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    MercanciasRoutingModule,
    FormsModule,
    HttpModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    SharedModule,
    TextMaskModule,
    MatSnackBarModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [MercanciasComponent]
})
export class MercanciasModule { }
