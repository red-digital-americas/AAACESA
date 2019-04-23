import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {IOption} from 'ng-select';

import { Http } from '@angular/http';


@Component({
  templateUrl: './previos.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
  './previos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreviosComponent implements OnInit {
  isDropup = true;
  showBoundaryLinks = true;
  firstText = 'PRIMERA';
  lastText = 'ÚLTIMA';
  public data;
  public filterQuery = '';

  constructor(private http: Http) {
    http.get('assets/previos.json')
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

  ngOnInit() {
  }

}
