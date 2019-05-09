
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seguimientoAccionesPipe'
})
export class SeguimientoAccionesPipe implements PipeTransform {

  transform(status: string): any {
    const ESTADOS = ["Pendiente AAACESA", "Cancelada"];
    const DESCRIPCION = ["Enviar Corrección", "Cancelar"];

    for(let i=0; i<ESTADOS.length; i++) {
        if (status == ESTADOS[i]) {
            return DESCRIPCION[i];
        }
    } 
    return "";
  }
}
