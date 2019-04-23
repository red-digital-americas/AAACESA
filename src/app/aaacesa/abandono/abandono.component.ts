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
    // Date Picker
    bsValue2: any = '';
    bsFechaEstimada: any = '';

    public filterData;
    public data = [];
    public detailData = {};
    public filterQuery = '';

    public filterStatus = [true, true]

    constructor(private http: Http) {
      http.get('assets/abandono.json')
        .subscribe((data) => {
          setTimeout(() => {
            this.data = data.json();
            this.filterData = this.data;
          }, 2000);
        });
    }

    public toInt(num: string) {
      return +num;
    }

    public sortByWordLength = (a: any) => {
      return a.name.length;
    }

    public applyFilter(index: number) {
      this.filterData = [];

      if (index < this.filterStatus.length) {
        this.filterData = this.data.filter (function (el) { return  el.status === this.statusEnum[index]; }.bind(this));
      } else {
        this.filterData = this.data;
      }
    }

    public verDetalle (id: string) {
      let tmp;
      tmp = this.data.filter (function (el) {
        return el.idPreAlerta === id;
      });

      this.detailData = tmp[0];
      // this.detalleModal.show();
      console.log(this.detailData);
    }

  }

