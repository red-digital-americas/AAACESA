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

import { AbandonoComponent } from './abandono.component';

const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: AbandonoComponent,
    data: {
      // title: 'DataTable'
      title: 'Abandono'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
// export class DatatableRoutingModule {}

export class AbandonoRoutingModule {}
