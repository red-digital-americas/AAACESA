import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalidasComponent } from './salidas.component';

const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: SalidasComponent,
    data: {
      // title: 'DataTable'
      title: 'Salidas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidasRoutingModule {}
