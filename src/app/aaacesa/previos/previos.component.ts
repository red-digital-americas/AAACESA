import { Component, ViewEncapsulation, OnInit, ViewChild, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

///////////
// Material
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

///////////
// API Services 
import { ApiServices } from '../../services/api.services';

///////////
// Modelos Previos
import { PrevioNuevo, PrevioBusqueda, Documento, Seguimiento } from '../../models/previos.model';


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
  busquedaModel:PrevioBusqueda = new PrevioBusqueda();  
  fechaPrevioSearch:Date = null;
  estatusSearch:any = "";  
  rangoFechaSearch:any = [];
  
  ///////////////////////
  // Status Filter Bar
  public statusEnum = ['Aceptada', 'Solicitada', 'Pendiente AAACESA', 'Pendiente Cliente', 'Rechazada', 'Finalizada', 'Cancelada'];
  public countStatus = {'Aceptada': 0, 'Solicitada': 0, 'PAAACESA': 0, 'PCliente': 0, 'Rechazada': 0, 'Finalizada': 0, 'Cancelada': 0}; 

  ///////////////////////
  // Mat Table  
  public data = [];                         // Data original consultada del servicio  
  public detailData = {};                   // Registro con el detalle obtenido
  dataSource = new MatTableDataSource();    // Data usada en la Mat Table

  displayedColumns: string[] = ['Master', 'House', 'Patente', 'Nombre', 'FechaPrevio', 'Referencia', 'Etiquetado', 'Estatus', 'Acciones'];    
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
          //console.log(f);
          let newDate = new Date(f);
          console.log(newDate);
          return newDate;
        }
        default: { return item[property];} 
      }
    };
  }            
    
  constructor(private http: Http, private apiService:ApiServices, public dialog: MatDialog) {            
    this.buscarPrevios();

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
    this.countStatus.Cancelada = this.data.filter(function (el) {return el.Estatus === 'Cancelada'; }).length;
  }

  public applyFilter(index: number) {
    this.dataSource.data = [];

    if (index < this.statusEnum.length) {
      this.dataSource.data = this.data.filter (function (el) { return  el.Estatus === this.statusEnum[index]; }.bind(this));
    } else {
      this.dataSource.data = this.data;
    }
  }  

  public buscarPrevios () {    
    // Estatus seleccionado "Niguno"
    if (typeof this.busquedaModel.Estatus === "undefined"){
      this.busquedaModel.Estatus = "";
    }
        
    // FechaPrevio
    if (this.fechaPrevioSearch != null){
      let f = this.fechaPrevioSearch.toISOString().slice(0,10); // 2019-11-23        
      f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;     // 20191123
      this.busquedaModel.FechaPrevio = f; 
    } else {
      this.busquedaModel.FechaPrevio = "";
    }

    // FechaInicial - FechaFinal
    if (this.rangoFechaSearch != null) {
      if (this.rangoFechaSearch[0] != null && this.rangoFechaSearch[1] != null){      
        let f = this.rangoFechaSearch[0].toISOString().slice(0,10);   // 2019-11-23        
        f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;         // 20191123
        this.busquedaModel.FechaInicial = f;
        f = this.rangoFechaSearch[1].toISOString().slice(0,10);       // 2019-11-23        
        f = `${f.slice(0,4)}${f.slice(5,7)}${f.slice(8,10)}`;         // 20191123
        this.busquedaModel.FechaFinal = f;            
      }    
    } else {    
      this.busquedaModel.FechaInicial = "";
      this.busquedaModel.FechaFinal = "";
    }    

    this.apiService.service_general_get_with_params('/AdelantoPrevios/Busqueda', this.busquedaModel)
      .subscribe ( 
      (response:any) => {                 
        this.data = response;        
        this.dataSource.data = this.data;
        this.updateCountStatus();
      }, 
      (errorService) => { console.log(errorService); });

    // http.get('assets/Previos/previos.json')
    //   .subscribe((data) => {
    //       this.data = data.json();
    //       this.dataSource.data = this.data;
    //       this.updateCountStatus();
    //   });  
  }

  public verDetalle (id: string) {    
    
      // id = "PRV-20190000143";
      // id = "PRV-20190000142";
      this.apiService.service_general_get(`/AdelantoPrevios/GetDetailsById/${id}`)
      .subscribe ( 
      (response:any) => { this.detailData = response;}, 
      (errorService) => { console.log(errorService); });

      // this.http.get('assets/Previos/previosDetalle.json')
      //   .subscribe((data) => { this.detailData = data.json(); console.log(this.detailData);});    
  }

  public openDocument (idDocumento) {   
    console.log(idDocumento); 
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreatePreviosComponent, {
      // width: '95%',        
      disableClose: true,
      data: { }      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  } 
}


//////////////////////////
// Stepper
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialogs/dialog-create-previos.component.html',
  providers: [FormBuilder]
})
export class DialogCreatePreviosComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
    
  model:PrevioNuevo = new PrevioNuevo();  

  constructor(
    public dialogRef: MatDialogRef<DialogCreatePreviosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      masterCtrl: ['', Validators.required],
      houseCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      nombreCtrl: ['', Validators.required],
      paternoCtrl: ['', Validators.required],
      maternoCtrl: ['', Validators.required],
      patenteCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      fechaPrevioCtrl: ['', Validators.required],
      numGafeteCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      piezasCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      pesoCtrl: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      etiquetadoCtrl: [false, Validators.required],
      comentarioCtrl: [''],    
    });
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //////////////////////////////////
  // Forms Logic - Crear Pre Alerta      
  stepClick(event) {
    // console.log(event)
    if (event.selectedIndex === 3){
      this.guardarFirstForm();
    }
  }

  guardarFirstForm () {
    // console.log(this.firstFormGroup.value);
    // console.log(this.secondFormGroup.value);
    this.model.Master = this.firstFormGroup.value.masterCtrl;
    this.model.House = this.firstFormGroup.value.houseCtrl;
    this.model.Nombre = this.secondFormGroup.value.nombreCtrl;
    this.model.Paterno = this.secondFormGroup.value.paternoCtrl;
    this.model.Materno = this.secondFormGroup.value.maternoCtrl;
    this.model.Patente = this.secondFormGroup.value.patenteCtrl;
    this.model.FechaPrevio = this.secondFormGroup.value.fechaPrevioCtrl;
    this.model.NumGafete = this.secondFormGroup.value.numGafeteCtrl;
    this.model.Piezas = this.secondFormGroup.value.piezasCtrl;
    this.model.Peso = this.secondFormGroup.value.pesoCtrl;
    this.model.Etiquetado = this.secondFormGroup.value.etiquetadoCtrl;
    if (this.secondFormGroup.value.comentarioCtrl == "") {      
      this.model.Seguimiento = [];
    } else {
      let seg:Seguimiento = new Seguimiento();
      seg.Comentarios = this.secondFormGroup.value.comentarioCtrl;
      let segArray:Seguimiento[] = [seg];
      this.model.Seguimiento = segArray;
    }

    // console.log(this.model);
  }

  removeDocument (index) { this.model.Documentos.splice(index, 1); }

  onFileChanged(event) {    
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].type != "application/pdf") { continue; }
      if(this.model.Documentos.filter(
        documento => documento.NombreDocumento.includes(event.target.files[i].name)).length > 0)
      {continue;}

      let newDocumento = new Documento();
      newDocumento.NombreDocumento = event.target.files[i].name;

      let reader = new FileReader();    
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = () => {
        // console.log(reader.result);
        newDocumento.Archivo = reader.result.slice(28).toString();        
        this.model.Documentos.push(newDocumento);
      };
      reader.onerror = (error) => {
        console.log(error);        
      };                    
   }
  }
}