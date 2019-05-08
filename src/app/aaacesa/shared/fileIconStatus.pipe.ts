
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileIconStatusPipe'
})
export class FileIconStatusPipe implements PipeTransform {
    // Asociacion de estados con su respectiva clase para el icono
    estados = ['Pendiente', 'Valido', 'Invalido'];
    classFA = ['fa-file-pdf', 'fa-file-archive', 'fa-file-image'];   

  transform(estado: string): any {        

    let index:number = 0;   // Default Pendiente
    for (let i=0; i < this.estados.length; i++) {
        if (this.estados[i] === estado) { index = i; }        
    }    
    return this.classFA[index];
  }
}
