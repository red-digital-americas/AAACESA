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
    new Summary("Previos", 50, "bg-gray"),
    new Summary("Salidas", 100, "bg-salidas"),
    new Summary("Transferencias", 120, "bg-transfer"),
    new Summary("Abandono", 80, "bg-abandono")
  ]




  public merchant: any[] = [
    new Merchant("021563431", "12345978", "21/03/2018", "Transfer"),
    new Merchant("021563431", "12345978", "21/03/2018", "Salida"),
    new Merchant("021563431", "12345978", "21/03/2018", "Previo"),
    new Merchant("021563431", "12345978", "21/03/2018", "Abandono"),
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
            label: "Transferencias",
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
}
