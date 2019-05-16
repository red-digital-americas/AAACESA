import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getSelect'
})
export class GetSelectPipe implements PipeTransform {

  transform(array: any[], query: string, mode: number, k = 0): string {
    if (query == undefined) { return '';}

    let filterValue = query.toLowerCase();
    let keys = [];
    if (array.length > 0) {
      keys = Object.keys(array[0]);
    }        
    
    let result = array.filter(option => option[keys[k]].toLowerCase().includes(filterValue));
    if (result == undefined) { return '';}

    if (mode == 0) {
        return result[0][keys[0]];
    } else if (mode == 1) { 
        return result[0][keys[1]];
    } else if (mode == 2) {
        return `${result[0][keys[0]]} - ${result[0][keys[1]]}`;
    }
  }
}
