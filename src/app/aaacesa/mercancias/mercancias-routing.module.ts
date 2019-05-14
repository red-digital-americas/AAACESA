import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MercanciasComponent } from './mercancias.component';

const routes: Routes = [
  {
    path: '',
    component: MercanciasComponent,
    data: {
      title: 'Consulta de Mercancías'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MercanciasRoutingModule { }
