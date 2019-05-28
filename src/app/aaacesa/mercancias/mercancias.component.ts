import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class MercanciasComponent implements OnInit, AfterViewInit {

  loading = false;
  visible = true;
  masterMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  busquedaModel: MercanciasBusqueda = new MercanciasBusqueda();
 
  @ViewChild('InfoGeneralPag', {read:MatPaginator}) InfoGeneralPag: MatPaginator;
  @ViewChild('InfoEstatusPag',{read:MatPaginator}) InfoEstatusPag: MatPaginator;
  @ViewChild('InfoSalidasPag',{read:MatPaginator}) InfoSalidasPag: MatPaginator;
  @ViewChild('InfoTranferenciaPag',{read:MatPaginator}) InfoTranferenciaPag: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  //Tabla Información General
  infoGralColumns: string[] = [ 'Piezas', 'FechaArribo', 'Peso','Parcialidad', 'DescMercancia'];
  dataGetInfoG = new MatTableDataSource();
  getInfoGral: GetInformacionGeneral = new GetInformacionGeneral();
  visibleIG = true;

  //Tabla Información Estatus
  estatusColumns: string[] = [ 'UltimaZona', 'FechaUltimoPrevio', 'FechaAbandono','PesoUltimoPrevio', 'PzasUltimoPrevio','NumPrevios'];
  dataEstatus = new MatTableDataSource();
  getEstatus: GetEstatus = new GetEstatus();
  visibleES = true; 
  
  //Tabla Información Salidas
  infoSalidasColumns: string[] = [ 'FechaSalida', 'Pedimento', 'Folio','RFC', 'Importe','piezas', 'Peso'];
  dataInfoSalidas = new MatTableDataSource();
  getInfoSalidas: GetInformacionSalidas = new GetInformacionSalidas();
  visibleIS = true;
  
  //Tabla Estatus Transferencia
  statTransColumns: string[] = [ 'FechaPrealerta', 'Recoleccion', 'FechaDocumentosDisponibles','FechaCargaDisponible', 'InstruccionManejo'];
  dataStatTrans = new MatTableDataSource();
  getStatTrans: GetEstatusTransferencia = new GetEstatusTransferencia();
  visibleET = true;
  

  ngAfterViewInit(){
    this.dataGetInfoG.paginator = this.InfoGeneralPag;
    this.dataEstatus.paginator = this.InfoEstatusPag;
    this.dataInfoSalidas.paginator = this.InfoSalidasPag;
    this.dataStatTrans.paginator = this.InfoTranferenciaPag;
    this.InfoGeneralPag._intl.itemsPerPageLabel = "Registros por página";

    const rangoLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) { return `0 de ${length}`; }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
 
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.dataGetInfoG.paginator._intl.getRangeLabel = rangoLabel;

  }

  constructor(private http: Http, private apiserv: ApiServices,public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.click();
    
  }

  buscarMercancias(){
    this.loading=true;

    // Tabla GetInformacionGeneral
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetInformacionGeneral',this.busquedaModel).subscribe((data) => {
      this.loading= false;
      this.visible=false;
      this.visibleIG=false;
      this.dataGetInfoG.data= data;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleIG=true;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert("En algún estatus: "+error);
      }
    });

    //Tabla GetEstatus
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetEstatus',this.busquedaModel).subscribe((dataE) => {
      this.loading= false;
      this.visible=false;
      this.visibleES=false;
      this.dataEstatus.data= dataE;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleES=true;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert( "En algún estatus: "+error);
      }
    });

    //Tabla GetInformacionSalidas
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetInformacionSalidas',this.busquedaModel).subscribe((dataI) => {
      this.loading= false;
      this.visible=false;
      this.visibleIS=false;
      this.dataInfoSalidas.data= dataI;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleIS=true;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert("En algún estatus: "+error);
      }
    });

    
    //Tabla GetEstatusTransferencia
    this.apiserv.service_general_get_with_params('/ConsultaMercancia/GetEstatusTransferencia',this.busquedaModel).subscribe((dataT) => {
      let array:any[] = [];
      this.loading= false;
      this.visible=false;
      this.visibleET=false;
      array.push(dataT);
      this.dataStatTrans.data = array;
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleET=true;
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert("En algún estatus: "+error);
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
