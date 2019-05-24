import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';

@Injectable()
export class ApiServices {
  // public url="http://api.desarrollo.com.mx/api";
  public url = "http://192.170.15.17:8089/api";
  loading= false;

  constructor(private http: HttpClient, private https: Http) { }

  public getJSON(_jsonURL): Observable<any> {
    return this.https.get(_jsonURL)
      .map((response: any) => response.json());
  }

  service_general_get(url): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get(this.url + url, { headers: headers });
  }

  service_general_get_with_params(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get(this.url + url, { headers: headers, params: parametros });
  }

  service_general_post(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.post(this.url + url, parametros, { headers: headers });
  }

  service_general_put(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.put(this.url + url, parametros, { headers: headers });
  }
}
