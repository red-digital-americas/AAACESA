import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { ApiServices } from '../../services/api.services';
import { BitacorasBusqueda, BitacoraResult } from '../../models/bitacoras.model';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { BsDatepickerConfig, BsLocaleService, defineLocale, deLocale } from 'ngx-bootstrap';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-bitacoras',
  templateUrl: './bitacoras.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})

export class BitacorasComponent implements OnInit {

  displayedColumns: string[] = ['Nombre', 'Accion', 'Detalle', 'Fecha', 'Hora'];
  dataSource: MatTableDataSource<BitacoraResult>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  visibleRes= false;

  

  public busquedaBit: BitacorasBusqueda = new BitacorasBusqueda();
  rangoFechaSearch:any = [];
  loading=false;
  moduloSearch: any = "";
  modulosGet = [];
  usuarioSearch: any = "";
  usuariosGet = [];

  constructor(private http: Http, private apiserv: ApiServices, private dialog: MatDialog,public snackBar: MatSnackBar, private localeService: BsLocaleService) {
    this.localeService.use('es');
  }

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
      this.visibleRes = true;
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
          default: { return item[property];} 
        }
      };
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      console.log(err.error);
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    }); 

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFlitros(){
    this.busquedaBit.Clean();
    this.rangoFechaSearch = "";
    this.dataSource.data = [];
    this.visibleRes = false;
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}
