import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

//////////////////////////
// Vendors Components
import { MatDatepickerModule } from '@angular/material/datepicker';
// DataTable
import { DataTableModule } from 'angular2-datatable';
// Angular 2 Input Mask
import { TextMaskModule } from 'angular2-text-mask';
// Timepicker
import { TimepickerModule } from 'ngx-bootstrap';
// Datepicker
import { BsDatepickerModule } from 'ngx-bootstrap';
// Ng2-select
import { SelectModule } from 'ng-select';
//Modal
import { ModalModule } from 'ngx-bootstrap/modal';
// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';


/////////////////////
// Components
import { PrealertasComponent } from './prealertas.component';

/////////////////////
// Pipes
import { StatusPipe } from './status.pipe';
import { FileIconPipe } from './fileIcon.pipe';

/////////////////////////
// Routing
import { PrealertasRoutingModule } from './prealertas-routing.module';

////////////////
// Services
import { CatalogosService } from '../../services/catalogos.service';

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
    CollapseModule.forRoot()
  ],
  declarations: [    
    PrealertasComponent,   
    StatusPipe,
    FileIconPipe
  ],
  providers: [
    CatalogosService
  ]
})
export class PrealertasModule { }
