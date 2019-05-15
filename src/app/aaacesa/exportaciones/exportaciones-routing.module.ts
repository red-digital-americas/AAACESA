
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { DataTableComponent } from './datatable.component';

import { ExportacionesComponent } from './exportaciones.component';

const routes: Routes = [
  {
    path: '',
    // component: DataTableComponent,
    component: ExportacionesComponent,
    data: {
      // title: 'DataTable'
      title: 'Exportaciones'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportacionesRoutingModule {}