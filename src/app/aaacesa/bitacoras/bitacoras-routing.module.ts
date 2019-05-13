import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BitacorasComponent } from './bitacoras.component';

const routes: Routes = [
  {
    path: '',
    component: BitacorasComponent,
    data: {
      title: 'Bitácora de Usuarios'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BitacorasRoutingModule { }
