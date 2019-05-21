import { Component, Input, OnInit, Inject } from '@angular/core';
import { navItems } from './../../_nav';
import { Router } from '@angular/router';
import { UserIdleConfig, UserIdleService } from 'angular-user-idle';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ApiServices } from '../../services/api.services';
import { HttpErrorResponse } from '@angular/common/http';

export interface DialogData {
  visible: boolean;
  respuesta: boolean;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers: [ApiServices]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public configValues: UserIdleConfig = new UserIdleConfig();
  public user : string;
  public rolUser : string;
  public IDUSR;
  public logTime;
  public lastTime;
  refreshToken;
  loading=false;
  date;
  visible: boolean = false;
  respuesta: boolean = true;

  public toogleCalc = false;

  public notificacionesArray = [];
  public notificacionesActiveCount = 0;
  

  ngOnInit() {
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe((count)=>{

    });
    
    this.userIdle.ping$.subscribe(() => {
      this.sesionDialog("Aviso de cierre de sesión","La sesión se cerrará en 5 minutos. Tome sus precauciones",true);
    });
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>{ 

      this.sesionDialog("Cierre de sesión","La sesión a caducado, será redirigido al login",false);
      setTimeout(function(){
        localStorage.clear();
        window.location.href ="login";
      },6000);
    });

     if (localStorage.getItem("user") == undefined) {
       this.router.navigate(['/login']);
     }
     else {
       this.IDUSR = JSON.parse(localStorage.getItem("user"));
       this.user = this.IDUSR.Nombre+" "+this.IDUSR.Paterno+" "+this.IDUSR.Materno;
       this.rolUser = JSON.parse(localStorage.getItem("rol"));
       this.logTime = new Date(localStorage.getItem("mytime"));
       this.lastTime = this.IDUSR.FechaUltimaSesion;
     }

  }

  constructor(private router: Router, private userIdle: UserIdleService,public dialog: MatDialog, private apiservice: ApiServices, private snackBar: MatSnackBar) {
    (this.getTimeSesion())?"":this.closeSession();
    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });    

    this.getNotificaciones();     
  }

  redirect(ruta){
    this.router.navigate(['/'+ruta+'']);
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }
   
  sesionDialog(titulo,mensaje,visible)
  {
    const dialogRef = this.dialog.open(DialogSessionComponent, {
      width: '95%',
      data: { 
        title: titulo,
        mensaje: mensaje,
        respuesta: this.respuesta,
        visible: visible
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.respuesta = result;
      this.refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
      if(result){
        this.apiservice.service_general_post('/Authentication/Refresh',{RefreshToken: this.refreshToken}).subscribe((respuesta)=>{
          localStorage.removeItem('token');
          localStorage.setItem('token', respuesta.Token);
          this.userIdle.resetTimer();
        });
      }
    }, 
    (err: HttpErrorResponse) => { 
      if (err.error instanceof Error) {
        this.sendAlert('Error:'+ err.error.message);
      } else {
        let error= (err.error.Description == undefined)?err.error:err.error.Description;
        this.sendAlert(error);
      }
    });
  }
  
  closeSession(){
    this.loading=true;
    this.apiservice.service_general_put('/Authentication/LogOut',{});
    localStorage.clear();
  }

  sendAlert(mensaje:string){
    this.snackBar.open(mensaje, "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  
  getTimeSesion(){
    //Tiempo actual
    let dt = new Date();
    // Tiempo de incio de sesion
    let dtS = new Date(localStorage.getItem("mytime"));

    //Agregar 1 hora al inicio de sesion
    let x = new Date(localStorage.getItem("mytime"));
    let oneHrMas = new Date((x.setHours(x.getHours() + 1 )));
    
    //Diferencia de inicio de sesion y tiempo actual
    let msecInit = dt.getTime() - dtS.getTime();

    //Diferencia entre inicio de sesion y 1Hr de cierre de sesion
    let msecFin = dt.getTime() - oneHrMas.getTime();

    //Minutus restantes para cierre de sesión
    let secTimeout = Math.floor((oneHrMas.getTime() - dt.getTime())/ 1000);
    let Ping = secTimeout -300;
    let secPing = ( Ping <= 300)?0:Ping;
    
    let difInitSesion = Math.floor(msecInit / 60000);
    let difFinSesion = Math.floor(msecFin / 60000)

    if(difInitSesion >= 60 && difFinSesion >= 0){
      return false;
    }
    else{
      this.configValues.idle = 0;
      this.configValues.timeout = secTimeout;
      this.configValues.ping = secPing;
      this.userIdle.setConfigValues(this.configValues);
      return true;
    }
  }

  ///////////////////////
  // Notificaciones
  getNotificaciones () {
    this.apiservice.service_general_get('/Dashboard/GetNotificaciones')
      .subscribe ( 
      (response:any) => { 
        this.notificacionesArray = response;
        this.getNotificacionesActiveCount();
      }, 
      (errorService) => { });
  }

  getNotificacionesActiveCount () {
    this.notificacionesActiveCount = this.notificacionesArray.filter ( (data) => { return !data.Read } ).length;
  }

  lecturaNotifcacion (idNotificacion) {
    // console.log(idNotificacion);
    this.apiservice.service_general_put('/Dashboard/LecturaNotificacion', {Id: idNotificacion})
      .subscribe ( 
      (response:any) => {         
        this.getNotificaciones();
      }, 
      (errorService) => { this.sendAlert("Ocurrio un problema."); });
  }



}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sesion - Dialog Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../../aaacesa/dialogs/dialog-sesion-alert.component.html'
})
export class DialogSessionComponent{

  constructor(public dialogRef: MatDialogRef<DialogSessionComponent>,@Inject(MAT_DIALOG_DATA) public data: any){}
}