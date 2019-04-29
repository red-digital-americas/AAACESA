import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

//////////////////////////
// Vendors Components
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DataTableModule } from 'angular2-datatable';     // DataTable
import { TextMaskModule } from 'angular2-text-mask';      // Angular 2 Input Mask
import { TimepickerModule } from 'ngx-bootstrap';         // Timepicker
import { BsDatepickerModule } from 'ngx-bootstrap';       // Datepicker
import { SelectModule } from 'ng-select';                 // Ng2-select
import { ModalModule } from 'ngx-bootstrap/modal';        //Modal

/////////////////////
// Components
import { PrealertasComponent } from './prealertas.component';

/////////////////////////
// Routing
import { PrealertasRoutingModule } from './prealertas-routing.module';

////////////////
// Services
import { CatalogosService } from '../../services/catalogos.service';

////////////////
// Shared
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [    
    PrealertasRoutingModule,
    CommonModule,
    DataTableModule,
    FormsModule,
// tslint:disable-next-line: deprecation
    HttpModule,
    MatDatepickerModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SelectModule,
    ModalModule,    
    SharedModule
  ],
  declarations: [    
    PrealertasComponent    
  ],
  providers: [
    CatalogosService
  ]
})
export class PrealertasModule { }
