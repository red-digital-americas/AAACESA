import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculadoraComponent } from './calculadora.component';

const routes: Routes = [
  {
    path: '',
    component: CalculadoraComponent,
    data: {
      title: 'Calculo de Maniobras'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class CalculadoraRoutingModule {}
