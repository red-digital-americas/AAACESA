import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { ApiServices } from '../../services/api.services';
import { BitacorasBusqueda } from '../../models/bitacoras.model';

@Component({
  selector: 'app-bitacoras',
  templateUrl: './bitacoras.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})

export class BitacorasComponent implements OnInit {

  displayedColumns: string[] = ['Usuario', 'Acciones', 'Detalles', 'Hora', 'Fecha'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public busquedaBit: BitacorasBusqueda = new BitacorasBusqueda();
  rangoFechaSearch:any = [];
  loading=false;
  moduloSearch: any = [];
  usuarioSearch: any = [];

  constructor(private http: Http, private apiserv: ApiServices, private dialog: MatDialog,public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.apiserv.service_general_get('/Bitacoras/Busqueda?FechaInicial=20190503&FechaFinal=20190503&Modulo=LOGIN&IdCuentaEspecifica=277').subscribe((data) => {
    });


    this.apiserv.service_general_get('/Bitacoras/Busqueda?FechaInicial=20190503&FechaFinal=20190503&Modulo=LOGIN&IdCuentaEspecifica=277').subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


  }

  buscarBitacoras(){

  }

  limpiarFlitros(){

  }

}
