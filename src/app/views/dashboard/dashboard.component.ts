import { Component, OnInit, Input } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Summary } from '../../aaacesa/general-summary/summary'
import { Merchant } from '../../aaacesa/general-summary/merchant'
import { Chart } from 'chart.js';
import { collectExternalReferences } from '@angular/compiler';
import { ApiServices } from '../../services/api.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ApiServices]
})

export class DashboardComponent implements OnInit {

  @Input() color: any
  @Input() summary: Summary
  
  public detailPrevios = "";
  public detailPrealertas = "";
  public detailSalidas = "";
  public detailAbandono = "";

  public currentIndex = 0;

  

   public summarys: any[] = [
    new Summary("Previos", "bg-gray"),
    new Summary("Salidas", "bg-salidas"),
    new Summary("Prealertas", "bg-transfer"),
    new Summary("Abandono", "bg-abandono")
  ] 

  public merchant: any[] = [
    new Merchant("021563431", "12345978", "21/03/2018", "Prealertas"),
    new Merchant("021563431", "12345978", "21/03/2018", "Salida"),
    new Merchant("021563431", "12345978", "21/03/2018", "Previo"),
    new Merchant("021563431", "12345978", "21/03/2018", "Abandono"),
  ]

  constructor(private apiservice:ApiServices) {}


  // barChart
  //public barChartOptions: any = {
  //  scaleShowVerticalLines: false,
  //  responsive: true,
  //  backgroundColor: "#8e5ea2",
  //};
  //public barChartLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  //public barChartType = 'bar';
  //public barChartLegend = true;
  //public barChartData: any[] = [
  //  { data: [65, 59, 80, 81, 56, 55, 40], label: 'Abandono' },
  //  { data: [28, 48, 40, 19, 86, 27, 90], label: 'Previo' },
  //  { data: [28, 48, 40, 19, 86, 27, 90], label: 'Salidas' },
  //  { data: [28, 48, 40, 19, 86, 27, 90], label: 'Transferencias' }
  //];

  ngOnInit(): void {
    this.dia();
    new Chart(document.getElementById("bar-chart-summary"), {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: "Prealertas",
            backgroundColor: "#1E82BA",
            data: [65, 59, 80, 8, 56, 60, 4, 8, 11, 5, 94, 56]
          },
          {
            label: "Previos",
            backgroundColor: "gray",
            data: [65, 59, 80, 81, 56, 55, 40, 8, 11, 78, 34, 12]
          },
          {
            label: "Salidas",
            backgroundColor: "#1EC8F3",
            data: [23, 45, 8, 90, 56, 40, 40, 8, 11, 78, 94, 56]
          },
          {
            label: "Abandono",
            backgroundColor: "#D9E11E",
            data: [25, 79, 40, 81, 56, 55, 90, 8, 11, 78, 54, 56]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Cantidad VS Estado'
        }
      }
    });


    

  }

  public dia() {
    this.currentIndex = 0;
    this.detailPrevios = "";
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailPrevios = response.Dia
        console.log(this.detailPrevios);
      },
      (errorService) => { 
        console.log(errorService);
      })

      this.detailSalidas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetSalidas`).subscribe (
        (response:any) => {
          this.detailSalidas = response.Dia;
          console.log(this.detailSalidas);
        },
        (errorService) => {
          console.log(errorService);
        })

        this.detailPrealertas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetPrealertas`).subscribe (
        (response:any) => {
          this.detailPrealertas = response.Dia;
          console.log(this.detailPrealertas);
        },
        (errorService) => {
          console.log(errorService);
        })

        this.detailAbandono = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetAbandono`).subscribe (
        (response:any) => {
          this.detailAbandono = response.Dia;
          console.log(this.detailAbandono);
        },
        (errorService) => {
          console.log(errorService);
        })
  }

  public semana() {
    this.currentIndex = 1;
    this.detailPrevios = "";
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailPrevios = response.Semana
        console.log(this.detailPrevios);
      },
      (errorService) => { 
        console.log(errorService);
      })

      this.detailSalidas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetSalidas`).subscribe (
        (response:any) => {
          this.detailSalidas = response.Semana;
          console.log(this.detailSalidas);
        },
        (errorService) => {
          console.log(errorService);
        })

        this.detailPrealertas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetPrealertas`).subscribe (
        (response:any) => {
          this.detailPrealertas = response.Semana;
          console.log(this.detailPrealertas);
        },
        (errorService) => {
          console.log(errorService);
        })

        this.detailAbandono = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetAbandono`).subscribe (
        (response:any) => {
          this.detailAbandono = response.Semana;
          console.log(this.detailAbandono);
        },
        (errorService) => {
          console.log(errorService);
        })
  }

  public mes() {
    this.currentIndex = 2;
    this.detailPrevios = "";
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailPrevios = response.Mes
        console.log(this.detailPrevios);
      },
      (errorService) => { 
        console.log(errorService);
      })

      this.detailSalidas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetSalidas`).subscribe (
        (response:any) => {
          this.detailSalidas = response.Mes;
          console.log(this.detailSalidas);
        },
        (errorService) => {
          console.log(errorService);
        })

        this.detailPrealertas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetPrealertas`).subscribe (
        (response:any) => {
          this.detailPrealertas = response.Mes;
          console.log(this.detailPrealertas);
        },
        (errorService) => {
          console.log(errorService);
        })

        this.detailAbandono = "";
      this.apiservice.service_general_get(`/Dashboard/GetWidgetAbandono`).subscribe (
        (response:any) => {
          this.detailAbandono = response.Mes;
          console.log(this.detailAbandono);
        },
        (errorService) => {
          console.log(errorService);
        })
  }

}
