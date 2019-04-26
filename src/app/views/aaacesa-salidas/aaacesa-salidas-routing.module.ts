import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AaacesaSalidasComponent } from './aaacesa-salidas.component';

const routes: Routes = [
  {
    path: '',
    component: AaacesaSalidasComponent,
    data: {
      title: 'Salidas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AaacesaSalidasRoutingModule {}
