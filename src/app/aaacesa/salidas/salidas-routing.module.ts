// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: []
// })
// export class AbandonoRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { DataTableComponent } from './datatable.component';

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
export class SalidasRoutingModule { }
