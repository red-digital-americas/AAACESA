import { Component, OnInit, Input } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Summary } from '../../aaacesa/general-summary/summary'
import { Merchant } from '../../aaacesa/general-summary/merchant'
import { Chart } from 'chart.js';
import { collectExternalReferences } from '@angular/compiler';
import { ApiServices } from '../../services/api.services';
import { mercancias } from '../../models/dashboard.model';
import { MatTableDataSource, MatSnackBar, } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { categoryAnualData, widgetAnualData } from '../../models/graficaDashboard.model';

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
  public WidgetData = new widgetAnualData();

  charts: boolean;
  

  private showAlert (msj:string) {
    this.snackBar.open(msj, "", {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

 

  dataInfoSalidas = new MatTableDataSource();
  searchModel = new Array<mercancias>();

   public summarys: any[] = [
    new Summary("Previos", "bg-gray"),
    new Summary("Salidas", "bg-salidas"),
    new Summary("Prealertas", "bg-transfer"),
    new Summary("Abandono", "bg-abandono")
  ] 

/*   public merchant: any[] = [
    new Merchant("021563431", "12345978", "21/03/2018", "Prealertas"),
    new Merchant("021563431", "12345978", "21/03/2018", "Salida"),
    new Merchant("021563431", "12345978", "21/03/2018", "Previo"),
    new Merchant("021563431", "12345978", "21/03/2018", "Abandono"),
  ] */

  constructor(private router: Router, private apiservice:ApiServices, public snackBar: MatSnackBar) {}
  
  redirect(ruta){
    this.router.navigate(['/'+ruta+'']);
  }

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
    this.getWidgetAnual();
    this.dia();

/*
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

    this.getMercancias(); */
  }

  public chart(formatData){

      new Chart(document.getElementById("bar-chart-summary"), {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [
            {
              label: "Prealertas",
              backgroundColor: "#1E82BA",
              data: formatData.Data[0].data
            },
            {
              label: "Previos",
              backgroundColor: "gray",
              data: formatData.Data[1].data
            },  
            {
              label: "Salidas",
              backgroundColor: "#1EC8F3",
              data: formatData.Data[2].data
            },
            {
              label: "Abandono",
              backgroundColor: "#D9E11E",
              data: formatData.Data[3].data
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

  public getWidgetAnual() {
    this.apiservice.service_general_get('/Dashboard/GetWidgetAnual').subscribe((datas) => {
      this.WidgetData.parseData(datas);
      this.chart(this.WidgetData);
      this.charts = true;
    }, 
    (err: HttpErrorResponse) => { 
      if (err.error instanceof Error) {
        this.showAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        /* this.showAlert(error); */
        this.charts = false;
      }
  }
    )
  }
    // **************************** Tabla de mercancias ****************************
    public getMercancias() {
      this.apiservice.service_general_get('/Dashboard/GetWidgetEstatusMercancia').subscribe((data) => {
        this.dataInfoSalidas.data = data.splice(0,4);
      
      }, 
      (err: HttpErrorResponse) => { 
        if (err.error instanceof Error) {
          this.showAlert('Error:'+ err.error.message);
        } else {
          let error= (err.error.Description == undefined)?err.error:err.error.Description;
          this.showAlert(error);
        }
    }
      )};



  public dia() {
    this.currentIndex = 0;
    this.detailPrevios = "";
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailPrevios = response.Dia
        
      },
      (errorService) => { 
        
      })

      this.detailSalidas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetSalidas`).subscribe (
        (response:any) => {
          this.detailSalidas = response.Dia;
          
        },
        (errorService) => {
          
        })

        this.detailPrealertas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetPrealertas`).subscribe (
        (response:any) => {
          this.detailPrealertas = response.Dia;
          
        },
        (errorService) => {
          
        })

        this.detailAbandono = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetAbandono`).subscribe (
        (response:any) => {
          this.detailAbandono = response.Dia;
         
        },
        (errorService) => {
          
        })
  }

  public semana() {
    this.currentIndex = 1;
    this.detailPrevios = "";
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailPrevios = response.Semana
        
      },
      (errorService) => { 
        
      })

      this.detailSalidas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetSalidas`).subscribe (
        (response:any) => {
          this.detailSalidas = response.Semana;
         
        },
        (errorService) => {
          
        })

        this.detailPrealertas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetPrealertas`).subscribe (
        (response:any) => {
          this.detailPrealertas = response.Semana;
         
        },
        (errorService) => {
          
        })

        this.detailAbandono = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetAbandono`).subscribe (
        (response:any) => {
          this.detailAbandono = response.Semana;
          
        },
        (errorService) => {
          
        })
  }

  public mes() {
    this.currentIndex = 2;
    this.detailPrevios = "";
    this.apiservice.service_general_get(`/Dashboard/GetWidgetPrevios`).subscribe (
      (response:any) => {
        this.detailPrevios = response.Mes
        
      },
      (errorService) => { 
        
      })

      this.detailSalidas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetSalidas`).subscribe (
        (response:any) => {
          this.detailSalidas = response.Mes;
          
        },
        (errorService) => {
        
        })

        this.detailPrealertas = "";
      this. apiservice.service_general_get(`/Dashboard/GetWidgetPrealertas`).subscribe (
        (response:any) => {
          this.detailPrealertas = response.Mes;
         
        },
        (errorService) => {
          
        })

        this.detailAbandono = "";
      this.apiservice.service_general_get(`/Dashboard/GetWidgetAbandono`).subscribe (
        (response:any) => {
          this.detailAbandono = response.Mes;
          
        },
        (errorService) => {
          
        })
  }

  click(){
    localStorage.setItem("clk", "1");
    let localSave = parseInt(localStorage.getItem("clk"));
    localSave++;
    localStorage.setItem("clk",localSave.toString());
  }
}
