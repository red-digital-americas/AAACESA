import { Component } from '@angular/core';


@Component({
  templateUrl: 'collapses.component.html'
})
export class CollapsesComponent {
  panelOpenState = false;

  constructor() { }

  isCollapsed: boolean = false;

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  

}
