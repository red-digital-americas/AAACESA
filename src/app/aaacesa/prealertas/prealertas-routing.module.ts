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

import { PrealertasComponent } from './prealertas.component';

const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: PrealertasComponent,
    data: {
      // title: 'DataTable'
      title: 'Prealertas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrealertasRoutingModule {}