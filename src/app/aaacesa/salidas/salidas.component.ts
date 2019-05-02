import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../../services/api.services';
import * as jquery from 'jquery';

export interface DialogData {
  animal: string;
  name: string;
}

export interface Salidas {
  IdAdelantoSalidas: string,
  Master: string,
  House: string,
  Correo: string,
  RFCFacturar: string,
  Pedimento: string,
  FechaCreacion: string,
  Estatus: string
}

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    '../../../scss/vendors/ng-select/ng-select.scss',
    './salidas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiServices]
})
export class SalidasComponent implements OnInit {

  displayedColumns: string[] = ['Master', 'House', 'Pedimento', 'RFCFacturar', 'FechaCreacion', 'Estatus', 'Acciones'];
  dataSource: MatTableDataSource<Salidas>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  estatusCatalogo = [];
  estatusSearch: any = "";
  public salidas: any = {
    IdAdelantoSalidas: "",
    FechaInicial: "",
    FechaFinal: "",
    Master: "",//"172-26765056",
    House: "",
    Estatus: "",
    Referencia: ""
  };
  public data;

  constructor(private apiservices: ApiServices, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.apiservices.service_general_get_with_params('/AdelantoFacturacion/Busqueda', this.salidas).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.apiservices.service_general_get('/Catalogos/GetCatalogoEstatus')
      .subscribe(
        (response: any) => { this.estatusCatalogo = response; },
        (errorService) => { console.log(errorService); });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  buscar_salida() {
    this.apiservices.service_general_get_with_params('/AdelantoFacturacion/Busqueda', this.salidas).subscribe((data) => {
      //console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  validar_campos(event) {
    for (var i = 0; i < event.length; i++) {
      console.log(event[i].name);
      if (!event[i].valid) {
        $("#" + event[i].name).focus();
        break;
      }
    }
    this.snackBar.open("Algunos campos necesitan ser revisados", "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateSalidaComponent, {
      width: '95%',
      data: { name: "", animal: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialogs/dialog-create-salida.component.html',
  providers: [FormBuilder]
})
export class DialogCreateSalidaComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  fourFormGroup: FormGroup;

  public documentos: any = {
    NombreDocumento: "",
    Archivo: ""
  }

  public nueva_salida: any = {
    Referencia: "",
    Master: "",
    House: "",
    RFCFacturar: "",
    Pedimento: "",
    Subdivision: false,
    FechaSalida: "",
    Patente: "",
    Seguimiento: [
      {
        Comentarios: ""
      }
    ],
    Documentos: this.documentos
  }

  constructor(
    public dialogRef: MatDialogRef<DialogCreateSalidaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.threeFormGroup = this._formBuilder.group({
      threeCtrl: ['', Validators.required]
    });
    this.fourFormGroup = this._formBuilder.group({
      fourCtrl: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
