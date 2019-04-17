import { Component, OnInit, Input } from '@angular/core';
import { Summary } from '../general-summary/summary';

@Component({
  selector: 'app-general-summary',
  templateUrl: './general-summary.component.html',
  styleUrls: ['./general-summary.component.scss']
})
export class GeneralSummaryComponent implements OnInit {

  constructor() { }

  @Input() color: any = "bg-green"
  @Input() summary: Summary

  ngOnInit() {
  }

}
