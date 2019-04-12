import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Summary } from '../../aaacesa/general-summary/summary'

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

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Abandono', backgroundColor: '#CF0A2B' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Previo', backgroundColor: '#FB600A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Salidas', backgroundColor: '#E2DA0C' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Transferencias', backgroundColor: '#0AA010' }
  ];

  ngOnInit(): void {
    
  }
}
