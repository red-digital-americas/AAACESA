import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviosComponent } from './previos.component';


const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: PreviosComponent,
    data: {
      // title: 'DataTable'
      title: 'Previos'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PreviosRoutingModule {}
