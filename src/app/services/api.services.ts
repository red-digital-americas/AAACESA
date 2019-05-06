import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { UserAuth } from '../models/user.models';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiServices {
  // public url="http://api.desarrollo.com.mx/api";
  public url = "http://192.170.15.17:8089/api";

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
