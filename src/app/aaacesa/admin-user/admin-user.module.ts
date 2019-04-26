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
import { DetalleUserComponent } from './detalle-user/detalle-user.component';
import { CrearUserComponent } from './crear-user/crear-user.component';

//Material
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    AdminUserRoutingModule,
    DataTableModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule
  ],
  declarations: [
    AdminUserComponent,
    DataFilterPipe,
    ModalsComponent,
    DetalleUserComponent,
    CrearUserComponent
  ],
  entryComponents: [DetalleUserComponent,CrearUserComponent]
})
export class AdminUserModule { }
