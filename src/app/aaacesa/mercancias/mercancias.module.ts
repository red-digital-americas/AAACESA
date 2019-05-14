import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MercanciasRoutingModule } from './mercancias-routing.module';
import { MercanciasComponent } from './mercancias.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDatepickerModule, MatInputModule, MatTabsModule, MatIconModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    MercanciasRoutingModule,
    FormsModule,
    HttpModule,
    MatDatepickerModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    SharedModule,
    TextMaskModule
  ],
  declarations: [MercanciasComponent]
})
export class MercanciasModule { }
