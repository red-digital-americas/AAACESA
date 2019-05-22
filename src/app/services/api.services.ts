import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { UserAuth } from '../models/user.models';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UserIdleService } from 'angular-user-idle';

@Injectable()
export class ApiServices {
  // public url="http://api.desarrollo.com.mx/api";
  public url = "http://192.170.15.17:8089/api";

  constructor(private http: HttpClient, private https: Http, private userIdle: UserIdleService ) { }

  public getJSON(_jsonURL): Observable<any> {
    return this.https.get(_jsonURL)
      .map((response: any) => response.json());

  }

  service_general_get(url): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get(this.url + url, { headers: headers }).retryWhen(error => {
      return error
         .flatMap((error: any) => {
          console.log(error.status);
            if(error.status  === 401) {
              this.service_refresh_token();
              return Observable.of(error.status).delay(1000)
            }
            return Observable.throw({error: 'No retry'});
         })
         .take(5)
         .concat(Observable.throw({error: 'Sorry, there was an error (after 5 retries)'}));
      });
  }

  service_general_get_with_params(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));

    return this.http.get(this.url + url, { headers: headers, params: parametros }).retryWhen(error => {
      return error
         .flatMap((error: any) => {
          console.log(error.status);
            if(error.status  === 401) {
              this.service_refresh_token();
              return Observable.of(error.status).delay(1000)
            }
            return Observable.throw({error: 'No retry'});
         })
         .take(5)
         .concat(Observable.throw({error: 'Sorry, there was an error (after 5 retries)'}));
      });
  }

  service_general_post(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.post(this.url + url, parametros, { headers: headers }).retryWhen(error => {
      return error
         .flatMap((error: any) => {
          console.log(error.status);
            if(error.status  === 401) {
              this.service_refresh_token();
              return Observable.of(error.status).delay(1000)
            }
            return Observable.throw({error: 'No retry'});
         })
         .take(5)
         .concat(Observable.throw({error: 'Sorry, there was an error (after 5 retries)'}));
      });
  }

  service_general_put(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.put(this.url + url, parametros, { headers: headers }).retryWhen(error => {
      return error
         .flatMap((error: any) => {
          console.log(error.status);
            if(error.status  === 401) {
              this.service_refresh_token();
              return Observable.of(error.status).delay(1000)
            }
            return Observable.throw({error: 'No retry'});
         })
         .take(5)
         .concat(Observable.throw({error: 'Sorry, there was an error (after 5 retries)'}));
      });
  }

  service_refresh_token(){
    let refreshToken = localStorage.getItem("refreshToken");
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    this.http.post('/Authentication/Refresh',{RefreshToken: refreshToken},{ headers: headers }).subscribe((respuesta)=>{
      console.log(respuesta);
      let myDate = new Date();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('mytime');
      localStorage.setItem('token', respuesta['Token']);
      localStorage.setItem('refreshToken', respuesta['RefreshToken']);
      localStorage.setItem("mytime", myDate.toString());
      this.userIdle.stopWatching();
      this.userIdle.setConfigValues({idle:0, timeout:3300,ping:3000});
      this.userIdle.startWatching();
    });
  }
}
