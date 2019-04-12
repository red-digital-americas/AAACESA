import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from "@angular/common";

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

/** Imports de Material */
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { UsuarioComponent } from '../../aaacesa/usuario/usuario.component';
import { ContadorComponent } from '../../aaacesa/contador/contador.component';
import { GeneralSummaryComponent } from '../../aaacesa/general-summary/general-summary.component'

@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    ContadorComponent,
    GeneralSummaryComponent
  ],
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    CommonModule
  ],
  exports: [
    UsuarioComponent,
    ContadorComponent
  ]
})
export class DashboardModule {
  
}
