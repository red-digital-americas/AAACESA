import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { ApiServices } from '../../services/api.services';
import { BitacorasBusqueda } from '../../models/bitacoras.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { BsDatepickerConfig, BsLocaleService, defineLocale, deLocale } from 'ngx-bootstrap';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';

@Component({
  selector: 'app-bitacoras',
  templateUrl: './bitacoras.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})

export class BitacorasComponent implements OnInit {

  displayedColumns: string[] = ['Nombre', 'Accion', 'Detalle', 'Hora', 'Fecha'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  

  public busquedaBit: BitacorasBusqueda = new BitacorasBusqueda();
  rangoFechaSearch:any = [];
  loading=false;
  moduloSearch: any = "";
  modulosGet = [];
  usuarioSearch: any = "";
  usuariosGet = [];

  constructor(private http: Http, private apiserv: ApiServices, private dialog: MatDialog,public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.apiserv.service_general_get('/Bitacoras/GetFiltroModulos').subscribe((resp) => {
      this.modulosGet = resp;
    });

    this.apiserv.service_general_get('/Bitacoras/GetFiltroUsuarios').subscribe((datos) => {
      this.usuariosGet = datos;
    });

  }

  buscarBitacoras(){
    this.loading= true;
    //FechaInicial - FechaFinal
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        this.busquedaBit.FechaInicial = moment(this.rangoFechaSearch[0]).format('YYYYMMDD');
        this.busquedaBit.FechaFinal = moment(this.rangoFechaSearch[1]).format('YYYYMMDD');
      }    
    } else {    
      this.busquedaBit.FechaInicial = "";
      this.busquedaBit.FechaFinal = "";
    }

    this.busquedaBit.Modulo = (this.busquedaBit.Modulo == undefined)?"":this.busquedaBit.Modulo;
    this.busquedaBit.IdCuentaEspecifica = (this.busquedaBit.IdCuentaEspecifica == undefined)?"":this.busquedaBit.IdCuentaEspecifica;
    this.apiserv.service_general_get_with_params('/Bitacoras/Busqueda',this.busquedaBit).subscribe((data) => {
      this.loading= false;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {      
        switch (property) {     
          case 'Fecha': {   
            let f = item['FechaCreacion'].split(' ')[0];                // 07/05/2019 12:00 PM          
             f = `${f.slice(3,5)}/${f.slice(0,2)}/${f.slice(6,10)}`;   // 05/07/2019
            //console.log(f);
            let newDate = new Date(f);
             console.log(newDate);
            return newDate;
            }
          case 'Hora':{
            let h = item['FechaCreacion'].split(' ')[1];
            console.log(h)
            let newHours = new Date(h);
            console.log(newHours);
            return newHours;
            }
          default: { return item[property];} 
        }
      };
    }); 

  }

  limpiarFlitros(){

  }

}
