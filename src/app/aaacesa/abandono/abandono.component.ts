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

import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  // templateUrl: 'datatable.component.html'
  templateUrl: 'abandono.component.html',
  styleUrls: ['./abandono.component.scss']
})
// export class DataTableComponent {
  export class AbandonoComponent {

   // Datepicker

   minDate = '';
   maxDate = '';

   bsValue: Date = new Date();
   bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];

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
