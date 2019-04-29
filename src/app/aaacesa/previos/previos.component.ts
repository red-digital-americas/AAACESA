import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

import { PrevioNuevo } from '../../models/previos.model';

@Component({
  templateUrl: './previos.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  '../../../scss/vendors/ng-select/ng-select.scss',
  './previos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class PreviosComponent  {
  ///////////////////////
  // Catalogos para los <select>
  estatusCatalogo = [];

  ///////////////////////
  // BusquedaSuperior
  showAdvanceSearch = true; // Don't Change
  masterHouseSearch = "";
  masterGuideSearch = "";
  fechaPrevioSearch:any = "";    
  rangoFechaSearch: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  idPrevioSearch = "";
  estatusSearch = "";
  patenteSearch = "";
  referenciaSearch = "";
  
  ///////////////////////
  // Mat Table
  displayedColumns: string[] = ['Master', 'House', 'Patente', 'Nombre', 'FechaPrevio', 'Referencia', 'Etiquetado', 'Estatus', 'Acciones'];  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;     
    this.dataSource.sortingDataAccessor = (item, property) => {      
      switch (property) {     
        case 'FechaPrevio': {              
          let f = item['FechaPrevio'].split(' ')[0];                // 07/05/2019 12:00 PM          
          f = `${f.slice(3,5)}/${f.slice(0,2)}/${f.slice(6,10)}`;   // 05/07/2019
          console.log(f);
          let newDate = new Date(f);
          console.log(newDate);
          return newDate;
        }
        default: { return item[property];} 
      }
    };
  }


  public statusEnum = ['Aceptada', 'Solicitada', 'Pendiente AAACESA', 'Pendiente Cliente', 'Rechazada', 'Finalizada', 'Cancelada'];
  public countStatus = {'Aceptada': 0, 'Solicitada': 0, 'PAAACESA': 0, 'PCliente': 0, 'Rechazada': 0, 'Finalizada': 0}; 
  
  // Date Picker
  bsValue2: any = '';
  bsFechaPrevio: any = '';  

  public filterData;
  public data = [];
  public detailData = {};
  public filterQuery = '';

  ////////////////////////
  // Forms    
  model:PrevioNuevo = new PrevioNuevo();    
  nFiles = [];      // Usado para poder añadir mas archivos en la parte del formulario crear Pre Alerta
  response = "";    // Respuesta al momento de crear Pre Alerta
  @ViewChild('form1', { read: NgForm }) form1: any;   // Referencia al form de la vista
  @ViewChild('form2', { read: NgForm }) form2: any;   // Referencia al form2 de la vista

  constructor(private http: Http, private apiService:ApiServices) {
    http.get('assets/Previos/previos.json')
      .subscribe((data) => {
          this.data = data.json();
          this.filterData = this.data;
          this.dataSource.data = this.filterData;
          this.updateCountStatus();
      });      

    this.apiService.service_general_get('/Catalogos/GetCatalogoEstatus')
      .subscribe ( 
      (response:any) => { this.estatusCatalogo = response;}, 
      (errorService) => { console.log(errorService); });
  }

  public updateCountStatus () {
    this.countStatus.Aceptada = this.data.filter(function (el) {return el.Estatus === 'Aceptada'; }).length;
    this.countStatus.Solicitada = this.data.filter(function (el) {return el.Estatus === 'Solicitada'; }).length;
    this.countStatus.PAAACESA = this.data.filter(function (el) {return el.Estatus === 'Pendiente AAACESA'; }).length;
    this.countStatus.PCliente = this.data.filter(function (el) {return el.Estatus === 'Pendiente Cliente'; }).length;
    this.countStatus.Rechazada = this.data.filter(function (el) {return el.Estatus === 'Rechazada'; }).length;
    this.countStatus.Finalizada = this.data.filter(function (el) {return el.Estatus === 'Finalizada'; }).length;
  }

  public applyFilter(index: number) {
    this.dataSource.data = [];

    if (index < this.statusEnum.length) {
      this.dataSource.data = this.data.filter (function (el) { return  el.Estatus === this.statusEnum[index]; }.bind(this));
    } else {
      this.dataSource.data = this.data;
    }
  }  

  public verDetalle (id: string) {    
    
      id = "PRV-20190000143";
      id = "PRV-20190000142";
      this.apiService.service_general_get(`/AdelantoPrevios/GetDetailsById/${id}`)
      .subscribe ( 
      (response:any) => { this.detailData = response;}, 
      (errorService) => { console.log(errorService); });

      // this.http.get('assets/Previos/previosDetalle.json')
      //   .subscribe((data) => { this.detailData = data.json(); console.log(this.detailData);});    
  }

  public openDocument (idDocumento) {    
    this.apiService.service_general_get(`/AdelantoPrevios/GetDocumentById/${idDocumento}`)
      .subscribe ( 
      (response:any) => {         
        var element = document.createElement('a');
        element.style.display = 'none';
        element.setAttribute('href', `data:application/pdf;base64,${response.Archivo}`);              
                
        // element.setAttribute('target','_blank');
        element.setAttribute('download', response.NombreDocumento);

        document.body.appendChild(element); element.click(); document.body.removeChild(element);
      
        ////// Alternative
        // window.open("data:application/pdf,base64ssdfasdf;", "_blank";
      }, 
      (errorService) => { console.log(errorService); });

    // this.http.get('assets/Previos/getDocumento.json')
    //   .subscribe((data) => {         
    //     let f = data.json().Archivo.split('data:application/pdf;');
    //     // window.open(data.json().Archivo, "_blank");
    //     window.open("data:application/pdf;" + encodeURI(f[1]));
    //   });    
  }

  


  private fileToBase64 (file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

}
