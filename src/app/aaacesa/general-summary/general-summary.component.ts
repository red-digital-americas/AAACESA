import { Component, OnInit, Input } from '@angular/core';
import { Summary } from '../general-summary/summary';
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-general-summary',
  templateUrl: './general-summary.component.html',
  styleUrls: ['./general-summary.component.scss'],
  providers: [ApiServices]
})
export class GeneralSummaryComponent implements OnInit {

  public detailWidget = {};
  //public summary = Summary;

  constructor(private apiservice:ApiServices) { }

  @Input() color: any = "bg-green"
  @Input() summary: Summary

   public detalleWidget (){
    this.detailWidget = {};
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailWidget = response;
        console.log(this.detailWidget);
      },
      (errorService) => { console.log(errorService);
      })
  } 

  ngOnInit() {
  }

}
