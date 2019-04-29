import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { SalidasComponent } from './salidas.component';
import { SalidasRoutingModule } from './salidas-routing.module';

// Acocordion
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MatExpansionModule,
    SalidasRoutingModule    
  ],
  declarations: [
    SalidasComponent
  ]
})
export class SalidasModule { }
