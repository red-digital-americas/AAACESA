//import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanzasComponent } from './finanzas.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: FinanzasComponent,
    data: {
      // title: 'DataTable'
      title: 'Finanzas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanzasRoutingModule { }
