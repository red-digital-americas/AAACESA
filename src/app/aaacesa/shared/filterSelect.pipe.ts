import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSelect'
})
export class FilterSelectPipe implements PipeTransform {

  transform(array: any[], query: string): string[] {
    let filterValue = query.toLowerCase();
    let keys = [];
    if (array.length > 0) {
      keys = Object.keys(array[0]);
    }        
    return array.filter(option => option[keys[0]].toLowerCase().includes(filterValue) || option[keys[1]].toLowerCase().includes(filterValue));
  }
}