
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estatusTransferenciaPipe'
})
export class EstatusTransferenciaPipe implements PipeTransform {            

    transform(estatus: string): any {    
        const MAYUS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
        let result = estatus.slice(0, 1);

        for (let i=1; i<estatus.length; i++) {
            if (MAYUS.indexOf(estatus[i]) > 0) { result =  result + " " ;}
            result = result + estatus[i];
        }

        if (result === "Recoleccion") { result = "Recolección";}
        return result;
    }
}
