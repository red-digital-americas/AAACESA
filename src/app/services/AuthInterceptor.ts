import {Injectable} from "@angular/core";
import { HttpHandler, HttpRequest, HttpClient, HttpEvent, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {HttpInterceptor} from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { ApiServices } from "./api.services";
import { UserIdleService } from "angular-user-idle";

@Injectable()
export class AuthInterceptor  implements HttpInterceptor {
    public url = "http://192.170.15.17:8089/api";
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    
 
    constructor(private apiservice: ApiServices, private http: HttpClient,private userIdle: UserIdleService) {}
 
    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }})
    }
 
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = localStorage.getItem('token');

        if (token) {
        req = req.clone({ setHeaders: {'token': token } });
        }
        return <any> next.handle(req)
            .catch(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 400:
                            console.log("error 400");
                            return <any> this.handle400Error(error);
                        case 405:
                            console.log("error 405");
                            return <any> error;
                        case 401:
                            console.log("error 401");
                            return <any> error;
                        case 0:
                            console.log("error 0");
                            return <any> this.handle401Error(req, next);
                    }
                } else {
                    return Observable.throw(error);
                }
            });
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

             let refreshToken = localStorage.getItem("refreshToken");
                let headers = new HttpHeaders();
                headers = headers.set('Content-Type', 'application/json; charset=utf-8');
                headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
                this.http.post(this.url +'/Authentication/Refresh',{RefreshToken: refreshToken},{ headers: headers })
                .subscribe((respuesta) => {
                    if (respuesta['Token']) {
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
                        console.log(this.userIdle.getConfigValue());

                        this.tokenSubject.next(respuesta['Token']);
                        return <any> next.handle(this.addToken(req, respuesta['Token']));
                    }
                    // If we don't get a new token, we are in trouble so logout.
                    return <any> this.apiservice.closeSession();
                }, 
                (err: HttpErrorResponse) => { 
                    return <any> this.apiservice.closeSession();
                });
                
                this.isRefreshingToken = false;
        } else {
            return this.tokenSubject
                .filter(token => token != null)
                .take(1)
                .switchMap(token => {
                    return <any>  next.handle(this.addToken(req, token));
                });
        }
    }

   

    logoutUser() {
        // Route to the login page (implementation up to you)

        return Observable.throw("");
    }

    handle400Error(error) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logoutUser();
        }
 
        return Observable.throw(error);
    }
}

// import {Injectable} from "@angular/core";
// import {HttpEvent, HttpHandler, HttpRequest, HttpClient, HttpHeaders} from "@angular/common/http";
// import {HttpInterceptor} from "@angular/common/http";
// import { Observable } from 'rxjs/Observable';
// import { debug } from "util";
// import { UserIdleService } from "angular-user-idle";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor
// {
//   constructor(public http: HttpClient, private userIdle: UserIdleService) { }
//   private url = "http://192.170.15.17:8089/api";

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let token = localStorage.getItem('token');

//     if (token) {
//       req = req.clone({ setHeaders: {'token': token } });
//     }

//     return <any> next.handle(req).catch(err => {
//       console.log(err);
//       if (err.status === 401 || err.status === 0) {
//         // if (err.error.message == "Token is exp") {          
//           console.log("Token expire");
//           //Genrate params for token refreshing
//           let params = { refreshToken: localStorage.getItem("refreshToken")};
//           let headers = new HttpHeaders();
//           headers = headers.set('Content-Type', 'application/json; charset=utf-8');
//           headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem("token"));
//           debugger;
//           // return this.http.post('localhost:8080/auth/refresh', params).flatMap(
//           // return this.http.post(this.url +'/Authentication/Refresh', params, { headers: headers }).flatMap(          
//           return <any> this.http.put(this.url +'/Authentication/Refresh', params,{ headers: headers }).subscribe(  
//             (data)=> {
//                 console.log(data); 
//               //If reload successful update tokens
//               if (data == 200) {
//                 //Update tokens
//                 // let myDate = new Date();
//                 // localStorage.removeItem('token');
//                 // localStorage.removeItem('refreshToken');
//                 // localStorage.removeItem('mytime');
//                 // localStorage.setItem('token', data.result.Token);
//                 // localStorage.setItem('refreshToken', data.result.RefreshToken);
//                 // localStorage.setItem("mytime", myDate.toString());
//                 // this.userIdle.stopWatching();
//                 // this.userIdle.setConfigValues({idle:0, timeout:3300,ping:3000});
//                 // this.userIdle.startWatching();
//                 // //Clone our fieled request ant try to resend it
//                 // req = req.clone({ setHeaders: { 'token': data.result.Token } });
//                 debugger;
//                 return <any> next.handle(req).catch(err => {
//                   //Catch another error
//                   return Observable.throw(err);
//                 });
//               } else {
//                 console.log(data);
//                 //Logout from account or do some other stuff
//               }
//             }       
//           );
//         // }          
//       }
//     })
//   }
// }