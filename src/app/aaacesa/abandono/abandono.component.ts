// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-abandono',
//   templateUrl: './abandono.component.html',
//   styleUrls: ['./abandono.component.scss']
// })
// export class AbandonoComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, ViewEncapsulation } from '@angular/core';
import {IOption} from 'ng-select';

import { Http } from '@angular/http';

@Component({
  // templateUrl: 'datatable.component.html'
  templateUrl: 'abandono.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
  './abandono.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// export class DataTableComponent {
  export class AbandonoComponent {

  public data;
  public filterQuery = '';

  constructor(private http: Http) {
    http.get('assets/abandono.json')
      .subscribe((data) => {
        setTimeout(() => {
          this.data = data.json();
        }, 2000);
      });
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }
}
