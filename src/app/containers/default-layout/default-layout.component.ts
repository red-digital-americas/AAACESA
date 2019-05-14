import { Component, Input, OnInit, Inject } from '@angular/core';
import { navItems } from './../../_nav';
import { Router } from '@angular/router';
import { UserIdleConfig, UserIdleService } from 'angular-user-idle';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public user : string;
  public rolUser : string;
  public IDUSR;
  public logTime;
  public lastTime;
  loading=false;
  date;
  

  ngOnInit() {
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => {
      
    });
    
    this.userIdle.ping$.subscribe(() => {
      this.sesionDialog("Aviso de cierre de sesión","La sesión se cerrará en 5 minutos. Tome sus precauciones");
    });
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>{ 
      this.sesionDialog("Cierre de sesión","La sesión a caducado, será redirigido al login");
      setTimeout(function(){
        localStorage.clear();
        window.location.href ="login";
      },3000);
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

  constructor(private router: Router, private userIdle: UserIdleService,public dialog: MatDialog) {
    (this.getTimeSesion())?"":this.closeSession();
    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
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
   
  sesionDialog(titulo,mensaje)
  {
    const dialogRef = this.dialog.open(DialogSessionComponent, {
      width: '95%',
      data: { 
        title: titulo,
        mensaje: mensaje
       }
    });
  }
  
  closeSession(){
    this.loading=true;
    localStorage.clear();
  }

  
  getTimeSesion(){
    let dt = new Date();
    let dtS = new Date(localStorage.getItem("mytime"));
    let x = new Date(localStorage.getItem("mytime"));
    let oneHrMas = new Date((x.setHours(x.getHours() + 1 )));
    
    let msecInit = dt.getTime() - dtS.getTime();
    let msecFin = dt.getTime() - x.getTime();
    let difInitSesion = Math.floor(msecInit / 60000);
    let difFinSesion = Math.floor(msecFin / 60000)
    console.log(difInitSesion);
    console.log(difFinSesion);

    if(difInitSesion >= 60 && difFinSesion >= 0){
      return false;
    }
    else{
      return true;
    }
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