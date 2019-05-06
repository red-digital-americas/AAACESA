
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe'
})
export class StatusPipe implements PipeTransform {

  transform(status: string): any {
    if (status == undefined) { return ""; } 
    return status.replace('.', "").replace(' ', '');
  }
}
