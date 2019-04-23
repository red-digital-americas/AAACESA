import { Component, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-prealertas',
  templateUrl: './prealertas.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
    './prealertas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrealertasComponent {
  // Date Range Picker  
  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  // Date Picker
  bsValue2: Date = new Date();

  public showAdvanceSearch = true;

  public filterData;
  public data = [];
  public detailData = {};
  public filterQuery = '';

  public countStatus = {"Aceptada": 0, "Solicitada": 0, "PAAACESA": 0, "PCliente": 0, "Rechazada": 0, "Finalizada": 0}
  public filterStatus = [true, true, true, true, true, true]

  // Modal
  public myModal;
  public myModal2;
  public myModal3;
  public detalleModal;

  constructor(private http: Http) {
    http.get('assets/prealertas.json')
      .subscribe((data) => {
        setTimeout(() => {
          this.data = data.json();
          this.filterData = this.data;
          this.updateCountStatus();
        }, 2000);
      });          
  }

  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

  public updateCountStatus () {    
    this.countStatus.Aceptada = this.data.filter(function (el) {return el.status == 'Aceptada';}).length; 
    this.countStatus.Solicitada = this.data.filter(function (el) {return el.status == 'Solicitada';}).length;
    this.countStatus.PAAACESA = this.data.filter(function (el) {return el.status == 'P.AAACESA';}).length;
    this.countStatus.PCliente = this.data.filter(function (el) {return el.status == 'P.Cliente';}).length;
    this.countStatus.Rechazada = this.data.filter(function (el) {return el.status == 'Rechazada';}).length;
    this.countStatus.Finalizada = this.data.filter(function (el) {return el.status == 'Finalizada';}).length;    
  }

  public toogleFilters(index: number) {
    if (index < this.filterStatus.length) {
      this.filterStatus[index] = !this.filterStatus[index];
    } else {
      for (let num=0; num < this.filterStatus.length; num++){
        this.filterStatus[num] = true;
      }
    }    
    //console.log(this.filterStatus);
    this.updateFilters();
  }

  private updateFilters () {
    this.filterData = [];    

    if (this.filterStatus[0]){
      this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'Aceptada';}));
    }  
    if (this.filterStatus[1]){
      this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'Solicitada';}));
    }
    if (this.filterStatus[2]){
      this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'P.AAACESA';}));
    }
    if (this.filterStatus[3]){
      this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'P.Cliente';}));
    }
    if (this.filterStatus[4]){
      this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'Rechazada';}));
    }
    if (this.filterStatus[5]){
      this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'Finalizada';}));
    }
                      
    // this.filterData = this.filterData.concat(this.data.filter (function (el) { return  el.status == 'Finalizada';}));    
    console.log(this.filterData);
  }

  public verDetalle (id: string) {      
    let tmp;  
    tmp = this.data.filter (function (el) {
      return el.idPreAlerta == id;
    });
    
    this.detailData = tmp[0];
    //this.detalleModal.show();
    console.log(this.detailData);
    
    // var newArray = homes.filter(function (el) {
    //   return el.price <= 1000 &&
    //          el.sqft >= 500 &&
    //          el.num_of_beds >=2 &&
    //          el.num_of_baths >= 2.5;
    // });
  }

}
