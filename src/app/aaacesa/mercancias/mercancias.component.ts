import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServices } from '../../services/api.services';
import { Http } from '@angular/http';
import { MatTabChangeEvent, MatSnackBar, MatSort, MatTableDataSource, MatPaginator, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { MercanciasBusqueda, GetInformacionGeneral, GetEstatus, GetInformacionSalidas, GetEstatusTransferencia } from '../../models/mercancias.model';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-mercancias',
  templateUrl: './mercancias.component.html',
  providers: [ApiServices]
})
export class MercanciasComponent implements OnInit {

  loading = false;
  visible = false;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  busquedaModel: MercanciasBusqueda = new MercanciasBusqueda();
  

  @ViewChild('tabGroup') tabGroup;

  //Tabla Información General
  infoGralColumns: string[] = [ 'Piezas', 'FechaArribo', 'Peso','Parcialidad', 'DescMercancia'];
  // @ViewChild('SortInfoG') SortInfoG: MatSort;
  // @ViewChild('PaginInfoG') PaginInfoG: MatPaginator;
  dataGetInfoG = new MatTableDataSource();
  getInfoGral: GetInformacionGeneral = new GetInformacionGeneral();
  visibleIG = false;

  //Tabla Información Estatus
  estatusColumns: string[] = [ 'UltimaZona', 'FechaUltimoPrevio', 'FechaAbandono','PesoUltimoPrevio', 'PzasUltimoPrevio','NumPrevios'];
  dataEstatus = new MatTableDataSource();
  getEstatus: GetEstatus = new GetEstatus();
  visibleES = false; 
  
  //Tabla Información Salidas
  infoSalidasColumns: string[] = [ 'FechaSalida', 'Pedimento', 'Folio','RFC', 'Importe','piezas', 'Peso'];
  dataInfoSalidas = new MatTableDataSource();
  getInfoSalidas: GetInformacionSalidas = new GetInformacionSalidas();
  visibleIS = false;
  
  //Tabla Estatus Transferencia
  statTransColumns: string[] = [ 'FechaPrealerta', 'Recoleccion', 'FechaDocumentosDisponibles','FechaCargaDisponible', 'InstruccionManejo'];
  dataStatTrans = new MatTableDataSource();
  getStatTrans: GetEstatusTransferencia = new GetEstatusTransferencia();
  visibleET = false;
  

  constructor(private http: Http, private apiserv: ApiServices,public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.click();
    
  }

  buscarMercancias(){
    this.loading=true;

    // Tabla GetInformacionGeneral
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetInformacionGeneral',this.busquedaModel).subscribe((data) => {
      this.loading= false;
      this.visible=true;
      this.visibleIG=true;
      this.loading=false;
      this.dataGetInfoG.data= data;
      // this.dataGetInfoG.paginator = this.PaginInfoG;
      // this.dataGetInfoG.sort = this.SortInfoG;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleIG=false;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });

    //Tabla GetEstatus
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetEstatus',this.busquedaModel).subscribe((dataE) => {
      this.loading= false;
      this.visible=true;
      this.visibleES=true;
      this.loading=false;
      this.dataEstatus.data= dataE;
      // this.dataGetInfoG.paginator = this.PaginInfoG;
      // this.dataGetInfoG.sort = this.SortInfoG;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleES=false;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert( error);
      }
    });

    //Tabla GetInformacionSalidas
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetInformacionSalidas',this.busquedaModel).subscribe((dataI) => {
      this.loading= false;
      this.visible=true;
      this.visibleIS=true;
      this.loading=false;
      this.dataInfoSalidas.data= dataI;
      // this.dataGetInfoG.paginator = this.PaginInfoG;
      // this.dataGetInfoG.sort = this.SortInfoG;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleIS=false;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });

    
    //Tabla GetEstatusTransferencia
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetEstatusTransferencia',this.busquedaModel).subscribe((dataT) => {
      let array:any[] = [];
      this.loading= false;
      this.visible=true;
      this.visibleET=true;
      this.loading=false;
      array.push(dataT);
      this.dataStatTrans.data = array;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleET=false;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });
  }

  limpiarFlitros(){
    this.getInfoGral.Clean();
    this.getEstatus.Clean();
    this.getInfoSalidas.Clean();
    this.getStatTrans.Clean();
    this.visible = false;
    this.visibleIG = false;
    this.visibleIS = false;
    this.visibleES = false;
    this.visibleET = false;
    this.dataGetInfoG.data = [];
    this.dataEstatus.data = [];
    this.dataInfoSalidas.data = [];
    this.dataStatTrans.data = [];
    this.busquedaModel.Clean();
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  click(){
    let localSave = parseInt(localStorage.getItem("mercaclick"));
    if(isNullOrUndefined(localSave) || isNaN(localSave)){
      localStorage.setItem("mercaclick", "1");
    } else {
      localSave++;
      localStorage.setItem("mercaclick",localSave.toString());
  
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {}

}
