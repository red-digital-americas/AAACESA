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

  constructor(private http: HttpClient, private https: Http, private userIdle: UserIdleService,private router: Router,) { }

  public getJSON(_jsonURL): Observable<any> {
    return this.https.get(_jsonURL)
      .map((response: any) => response.json());
  }

  service_general_get(url): Observable<any> {
    /* this.service_refresh_token(); */
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get(this.url + url, { headers: headers });
  }

  service_general_get_with_params(url, parametros): Observable<any> {
    /* this.service_refresh_token(); */
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get(this.url + url, { headers: headers, params: parametros });
  }

  service_general_post(url, parametros): Observable<any> {
    /* this.service_refresh_token(); */
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.post(this.url + url, parametros, { headers: headers });
  }

  service_general_put(url, parametros): Observable<any> {
    /* this.service_refresh_token(); */
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.put(this.url + url, parametros, { headers: headers });
  }

  service_refresh_token(){	
    let refreshToken = localStorage.getItem("refreshToken");	
    let headers = new HttpHeaders();	
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');	
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));	
    this.http.post(this.url +'/Authentication/Refresh',{RefreshToken: refreshToken},{ headers: headers }).subscribe((respuesta)=>{	
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
      // console.log(this.userIdle.getConfigValue());	
    }, 	
    (err: HttpErrorResponse) => { 
      if(err.status == 405){
        this.closeSession();	
      this.router.navigate(['/login']);
      }	
    });	
  }	

   closeSession(){	
    let headers = new HttpHeaders();	
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');	
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));	
    this.service_general_put(this.url +'/Authentication/LogOut',{ headers: headers });	
    localStorage.clear();	
    this.router.navigate(['/login']);	
  }
}
