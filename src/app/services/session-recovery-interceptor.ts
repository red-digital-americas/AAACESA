import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

import { ApiServices } from "./api.services";
import { UserIdleService } from "angular-user-idle";
// import { request } from "http";

@Injectable()
export class SessionRecoveryInterceptor implements HttpInterceptor {
  authService;
  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  constructor(private injector: Injector, private apiservice: ApiServices, private userIdle: UserIdleService) {}

  addAuthHeader(request) {
      // const authHeader = this.authService.getAuthorizationHeader();
      let token = localStorage.getItem('token');
      if (token) {
          return request.clone({
            headers: request.headers.set("Authorization", 'Bearer ' + token)
          });
      }
      return request;
  }

    refreshToken() {
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshTokenInProgress = true;
            // return this.authService.refreshToken()
            //    .do(() => {
            //         this.refreshTokenInProgress = false;
            //         this.tokenRefreshedSource.next();
            //     });
            return this.apiservice.service_refresh_token().do(
              (data: any) => {
                //If reload successful update tokens
                if (data) {
                  //Update tokens
                  let myDate = new Date();	
                  localStorage.removeItem('token');	
                  localStorage.removeItem('refreshToken');	
                  localStorage.removeItem('mytime');	
                  localStorage.setItem('token', data.Token);	
                  localStorage.setItem('refreshToken',data.RefreshToken);	
                  localStorage.setItem("mytime", myDate.toString());
                  this.userIdle.stopWatching();	
                  this.userIdle.setConfigValues({idle:0, timeout:3300,ping:3000});	
                  this.userIdle.startWatching();	
                  //Clone our fieled request ant try to resend it
                  this.refreshTokenInProgress = false;
                  this.tokenRefreshedSource.next();
                }else {
                  this.apiservice.closeSession();
                }
            });
        }
    }

    logout() {
        this.apiservice.closeSession();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // this.authService = this.injector.get(ApiServices);

        // Handle request
        request = this.addAuthHeader(request);
        if (request.url.endsWith("/LogOut")){
          return next.handle(request);
        } else {
        // Handle response
        return next.handle(request).catch(error => {

            if (error.status === 401) {
                return this.refreshToken()
                    .switchMap(() => {
                        request = this.addAuthHeader(request);
                        return next.handle(request);
                    })
                    .catch(() => {
                        this.logout();
                        return Observable.empty();
                    });
            }

            return Observable.throw(error);
        });
      }
    }
}