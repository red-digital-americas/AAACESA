import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent, DialogSessionComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMx, 'es-Mx');

// Providers

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ResetpasswordComponent } from './views/resetpassword/resetpassword.component';
import { MatInputModule, MatIconModule, MatSnackBarModule, MatCheckboxModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxLoadingModule } from 'ngx-loading';
import { UserIdleModule } from 'angular-user-idle';

import { BsDatepickerModule } from 'ngx-bootstrap';
import { CalculadoraModule } from './aaacesa/calculadora/calculadora.module';
import { AdminUserModule } from './aaacesa/admin-user/admin-user.module';



@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ResetpasswordComponent,
    DialogSessionComponent,
    // CalculadoraComponent
    // AbandonoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    TextMaskModule,
    MatSelectModule,
    NgxLoadingModule.forRoot({}),
    UserIdleModule.forRoot({idle:0, timeout:3300,ping:3000}),
    CalculadoraModule,
    AdminUserModule
  ],
  exports: [
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Mx' }],
  bootstrap: [ AppComponent ],

  entryComponents:[
    DialogSessionComponent
  ]

})
export class AppModule { }
