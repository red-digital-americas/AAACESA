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
    MatStepperModule
  ]
})
export class SalidasModule { }
