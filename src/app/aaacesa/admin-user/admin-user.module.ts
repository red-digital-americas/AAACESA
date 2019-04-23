import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { DataFilterPipe } from './datafilterpipe';
import { FormsModule } from '@angular/forms';


import { AdminUserRoutingModule } from './admin-user-routing.module';
import { AdminUserComponent } from './admin-user.component';

// Modal Component
import { ModalModule } from 'ngx-bootstrap';
import { ModalsComponent } from '../../views/notifications/modals.component';
import { DetalleUserComponent } from './detalle-user/detalle-user/detalle-user.component';

@NgModule({
  imports: [
    CommonModule,
    AdminUserRoutingModule,
    DataTableModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AdminUserComponent,
    DataFilterPipe,
    ModalsComponent,
    DetalleUserComponent
  ],
  entryComponents: [DetalleUserComponent]
})
export class AdminUserModule { }
