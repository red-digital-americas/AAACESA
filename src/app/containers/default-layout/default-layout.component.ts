import { Component, Input, OnInit } from '@angular/core';
import { navItems } from './../../_nav';

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
  

  ngOnInit() {
    if (localStorage.getItem("isAuth") == undefined) {
      window.location.href = "/login";
    }
    else{
      this.user = localStorage.getItem("Nombre");
      this.avatar = localStorage.getItem("avatar");
    }
  }

  constructor() {

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
