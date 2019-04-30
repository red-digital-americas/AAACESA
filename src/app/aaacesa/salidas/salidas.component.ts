import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../../services/api.services';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss'],
  providers: [ApiServices]
})
export class SalidasComponent implements OnInit {

  displayedColumns: string[] = ['Master', 'House', 'Pedimento', 'RFC', 'Fecha', 'Estatus', 'Acciones'];
  dataSource = new MatTableDataSource();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public data;
  animal: string;
  name: string;

  constructor(private apiservices: ApiServices, public dialog: MatDialog) { }

  ngOnInit() {

    this.apiservices.service_general_get_with_params('/AdelantoFacturacion/Busqueda', {
      "IdAdelantoSalidas": "",
      "FechaInicial": "",
      "FechaFinal": "",
      "Master": "",//"172-26765056",
      "House": "",
      "Estatus": "",
      "Referencia": ""
    }).subscribe((data) => {
      console.log(data);
      this.dataSource = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateSalidaComponent, {
      width: '95%',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
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
