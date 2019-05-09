import { Component, Input, OnInit } from '@angular/core';
import { navItems } from './../../_nav';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }
   
  
  closeSession(){
    this.loading=true;
    localStorage.clear();
    // this.router.navigate(['/login']);
  }
}
