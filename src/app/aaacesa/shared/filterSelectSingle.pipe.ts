import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSelectSingle'
})
export class FilterSelectSingle implements PipeTransform {

  transform(array: any[], query: string): string[] {
    if (array.length <= 0) { return array }  
    let filterValue = query.toLowerCase();
    return array.filter(option => option.toLowerCase().includes(filterValue));
  }
}
