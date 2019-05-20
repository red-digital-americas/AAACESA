import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ApiServices } from '../../../services/api.services';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { UserData } from '../../../models/user.models';
import { AbstractControl } from '@angular/forms';
import { Observable, Subject, empty } from 'rxjs';
import * as jquery from 'jquery';

@Component({
  selector: 'app-crear-user',
  templateUrl: './crear-user.component.html',
  styleUrls: ['./crear-user.component.scss'],
  providers: [ApiServices]
})
export class CrearUserComponent implements OnInit {

  //Tabla RFC
  displayedColumns: string[] = [ 'TipoCliente', 'RazonSocial', 'NumCuentas','acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;

  //Tabla Módulos
  columnsMod: string[] = [ 'ClaveModulo', 'Detalle'];
  dataSourceMod = new MatTableDataSource();
  visibleMods=false;

  //Perfil Admin
  rolAdminUSer:string=this.data.rolAdmin;
  visible: boolean=false;
  rfcVisible:boolean=false;
  RFCcliente;
  getRFCcliente;
  //Crear Usuario
  getPerfilUser:   string;
  final: boolean=false;
  mensaje="";
  public rfcCliente:string;
  public crearUser: UserData= new UserData();
  numCuentasAsig;

  public phoneModel = '';
  public phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  loading=false;

  constructor(private apiservices: ApiServices,private dialogRef: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.crearUser.RFC = this.data.rfcUser;
    this.crearUser.RazonSocial = this.data.razonSocUser;
    this.crearUser.ClavePatente = this.data.patenteUser;
    this.crearUser.TipoCliente = this.data.tipoUser;
    
    this.visible=(this.rolAdminUSer=='ADMIN')?true:false;
    this.apiservices.service_general_get("/Catalogos/GetPerfiles").subscribe((res)=>{
      this.getPerfilUser = res;
    });
  }

  crearUserByAdmin(selValue){
    this.crearUser.RFC = selValue.RFC;
    this.crearUser.RazonSocial = selValue.RazonSocial;
    this.crearUser.ClavePatente = selValue.ClavePatente;
    this.crearUser.TipoCliente = selValue.TipoCliente;
    this.crearUser.NumCuentas = selValue.NumCuentas;
    this.numCuentasAsig = selValue.NumCuentas;
    this.visible=false;
  }

  filterChanged(event)
  {
    this.visibleMods=true;
    this.dataSourceMod.data = event.Modulos;
  }

  buscaRFCUsuario(){
    this.loading=true;
    this.rfcVisible=true;
    this.apiservices.service_general_get("/Catalogos/GetClientes/"+this.rfcCliente).subscribe((res)=>{
      this.loading=false;
      this.dataSource.data= res;
      this.dataSource.sort = this.sort;
    });
  }

  guardaUsuario(accion) {
    this.loading=true;
    this.crearUser.Telefono =  this.crearUser.Telefono.replace(/\D+/g, '');
    this.apiservices.service_general_post("/AdministracionCuentas/CrearCuenta", this.crearUser ).subscribe((value) => {
      this.loading=false;  
      if(accion ==2)
      {
        this.crearUser.Clean();
        this.resetValues();
        this.visibleMods=false;
        this.dataSourceMod.data = [];
        this.sendAlert(value.Description);
      }
      else{
        this.final= (value.Result)?true:false;
        this.mensaje = value.Description
      }
      
    }, 
    (err: HttpErrorResponse) => { 
      this.loading=false;
      this.visibleMods=false;
      this.dataSourceMod.data = [];
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });
  }
  resetValues(){
    this.crearUser.RFC = this.data.rfcUser;
    this.crearUser.RazonSocial = this.data.razonSocUser;
    this.crearUser.ClavePatente = this.data.patenteUser;
    this.crearUser.TipoCliente = this.data.tipoUser;
    this.crearUser.NumCuentas = (this.rolAdminUSer=='ADMIN')?this.numCuentasAsig:"";
  }

  validar_campos(event) {
    for (var i = 0; i < event.length; i++) {
      if (!event[i].valid) {
        $("#" + event[i].name).focus();
        break;
      }
    }
    this.sendAlert("Algunos campos necesitan ser revisados");
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}
