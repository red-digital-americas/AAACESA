import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Summary } from '../../aaacesa/general-summary/summary'
import { Merchant } from '../../aaacesa/general-summary/merchant'
import { Chart } from 'chart.js';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public summarys: any[] = [
    new Summary("Abandono", 50, "bg-red"),
    new Summary("Previos", 100, "bg-orange"),
    new Summary("Salida", 120, "bg-yello"),
    new Summary("Trasnsferencias", 80, "bg-green")
  ]

  public summaryss: any[] = {
    new Summary()
  }



  public merchant: any[] = [
    new Merchant("021563431", "12345978", "21/03/2018", "Transfer"),
    new Merchant("021563431", "12345978", "21/03/2018", "Salida"),
    new Merchant("021563431", "12345978", "21/03/2018", "Previo"),
    new Merchant("021563431", "12345978", "21/03/2018", "Abandono"),
    new Merchant("021563431", "12345978", "21/03/2018", "Transfer"),
  ]
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
    new Chart(document.getElementById("bar-chart-summary"), {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: "Abandono",
            backgroundColor: "#CF0A2B",
            data: [65, 59, 80, 81, 56, 55, 40, 8, 11, 78, 34, 12]
          },
          {
            label: "Previos",
            backgroundColor: "#FB600A",
            data: [23, 45, 8, 90, 56, 40, 40, 8, 11, 78, 94, 56]
          },
          {
            label: "Salidas",
            backgroundColor: "#E2DA0C",
            data: [65, 59, 80, 8, 56, 60, 4, 8, 11, 5, 94, 56]
          },
          {
            label: "Trasferencias",
            backgroundColor: "#0AA010",
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
}
