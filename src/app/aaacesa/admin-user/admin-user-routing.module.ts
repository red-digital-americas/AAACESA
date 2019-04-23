import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUserComponent } from './admin-user.component';


const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: AdminUserComponent,
    data: {
      // title: 'DataTable'
      title: 'Administrador de Usuarios'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUserRoutingModule { }
