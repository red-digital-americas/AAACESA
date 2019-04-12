import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-general-summary',
  templateUrl: './general-summary.component.html',
  styleUrls: ['./general-summary.component.scss']
})
export class GeneralSummaryComponent implements OnInit {

  constructor() { }

  @Input() color: any = "bg-green"

  ngOnInit() {
  }

}
