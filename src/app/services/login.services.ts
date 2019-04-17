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
export class LoginServices{
    public url="http://104.130.201.153/";
    
    constructor(private http: HttpClient, private https: Http) { }

    public getJSON(_jsonURL): Observable<any> {
      return this.https.get(_jsonURL)
       .map((response:any) => response.json());
    
    }
    
    service_general(url, parametros): Observable<any> {
        let headers = new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        return this.http.post(this.url + url, parametros);
      }

}