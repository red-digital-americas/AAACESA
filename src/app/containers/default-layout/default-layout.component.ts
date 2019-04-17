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
  public avatar : string;
  public IDUSR;
  

  ngOnInit() {
    // if (localStorage.getItem("isAuth") == undefined) {
    //   window.location.href = "/login";
    // }
    // else{
    //   this.user = localStorage.getItem("Nombre");
    //   this.avatar = localStorage.getItem("avatar");
    // }
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.IDUSR = JSON.parse(localStorage.getItem("user"))[0];
      this.user = this.IDUSR.Nombre+" "+this.IDUSR.Paterno+" "+this.IDUSR.Materno;
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
    window.location.href = "/login";
  }
}
