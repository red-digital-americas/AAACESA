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
  public modulos : string;
  public avatar : string;
  public IDUSR;
  

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.IDUSR = JSON.parse(localStorage.getItem("user"));
      this.user = this.IDUSR.Nombre+" "+this.IDUSR.Paterno+" "+this.IDUSR.Materno;
      this.modulos= this.IDUSR.perfil['Modulos'];
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
