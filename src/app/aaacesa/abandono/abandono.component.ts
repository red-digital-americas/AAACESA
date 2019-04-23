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
// // todo: split
// import { Injectable } from '@angular/core';

// import { ConfigModel, PagerModel } from '../../models/';

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
  isDropup = true;
  showBoundaryLinks = true;
  firstText = 'PRIMERA';
  lastText = 'ÚLTIMA';
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

// /** Provides default values for Pagination and pager components */
// @Injectable()
// export class PaginationConfig {
//   main: ConfigModel = {
//     maxSize: void 0,
//     itemsPerPage: 10,
//     boundaryLinks: true,
//     directionLinks: true,
//     firstText: 'PRIMERA',
//     previousText: '< ANTERIOR',
//     nextText: 'SIGUIENTE >',
//     lastText: 'ÚLTIMA',
//     pageBtnClass: '',
//     rotate: true
//   };
//   pager: PagerModel = {
//     itemsPerPage: 15,
//     previousText: '< ANTERIOR',
//     nextText: 'SIGUIENTE >',
//     pageBtnClass: '',
//     align: true
//   };
// }