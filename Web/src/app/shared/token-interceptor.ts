import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { AdalService } from './services/adal.service';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from './services/common.service';
import { EnvService } from './services/env.service';
import { LoaderService } from './loader/loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  tokenVal: string;
  private config: adal.Config;
  graphToken: string;

  constructor(private adal: AdalService, private toasterService: ToastrService, private loader: LoaderService) {
    var envConfig = new EnvService();
    // var config = {
    //   tenant : envConfig.tenant,
    //   clientId : envConfig.clientId,
    //   postLogoutRedirectUri : window.location.origin,
    //   cacheLocation : "localStorage",
    //   redirectUri : envConfig.redirectUri,
    //   resource : envConfig.resource
    // };
    //"eyJ0eXAiOiJKV1QiLCJub25jZSI6IjYxSU5KWGM2ZzRCc3hFMGJZNjFjdU1RYXlhWS1UemlOdEp4WHRESEhOalUiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zNmRhNDVmMS1kZDJjLTRkMWYtYWYxMy01YWJlNDZiOTk5MjEvIiwiaWF0IjoxNTY0OTc4MjYxLCJuYmYiOjE1NjQ5NzgyNjEsImV4cCI6MTU2NDk4MjE2MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQyRmdZS2pVM1dMVzZmNkdmOXJMaXBVL1BLcE1Ua3FrZUQvTzViclFuM0w3NXJjSEtTMEEiLCJhbXIiOlsid2lhIl0sImFwcF9kaXNwbGF5bmFtZSI6IlVTIFBOU05leHRHZW5BZG1pbkRldiBOT05QUk9EIiwiYXBwaWQiOiIzYTAxMWYxMy0wYjk3LTRlOTUtOWJmNy0yOWY0YjBkMTE1M2IiLCJhcHBpZGFjciI6IjAiLCJjb250cm9scyI6WyJhcHBfcmVzIl0sImNvbnRyb2xzX2F1ZHMiOlsiMDAwMDAwMDMtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwIiwiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIl0sImRldmljZWlkIjoiYWNkMmUzZDQtODBmNi00ZmM3LWFkYTctMmJmMzcyZGI5YzAwIiwiZmFtaWx5X25hbWUiOiJDaGlubmkiLCJnaXZlbl9uYW1lIjoiTWlub29zaGEiLCJpcGFkZHIiOiIxNjcuMjE5LjQ4LjEwIiwibmFtZSI6IkNoaW5uaSwgTWlub29zaGEiLCJvaWQiOiI0NTI1OTIyNS1jZGU3LTQ1MGEtODI0ZC0zNDQ4ZmIzMWZiMWIiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjM4NDQ3Mjc2LTEwNDA4NjE5MjMtMTg1MDk1Mjc4OC0yNDczNzM2IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAwMzY1QzkxNjUiLCJzY3AiOiJHcm91cC5SZWFkLkFsbCBvcGVuaWQgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwiLCJzaWduaW5fc3RhdGUiOlsiZHZjX21uZ2QiLCJkdmNfZG1qZCIsImlua25vd25udHdrIiwia21zaSJdLCJzdWIiOiJJallSUkJHWEFlZmNUM3ZVS0lVNWZES2hUX2MwRXRlR3RINkNLbWhNaE80IiwidGlkIjoiMzZkYTQ1ZjEtZGQyYy00ZDFmLWFmMTMtNWFiZTQ2Yjk5OTIxIiwidW5pcXVlX25hbWUiOiJtY2hpbm5pQGRlbG9pdHRlLmNvbSIsInVwbiI6Im1jaGlubmlAZGVsb2l0dGUuY29tIiwidXRpIjoiNVgxenFEYUhtRTZpMzNPNlB3R2NBQSIsInZlciI6IjEuMCIsInhtc190Y2R0IjoxNDA1Njk0Mzg4fQ.G_y3CvpBlt3oUcSFWdtiTxp5ctaEP4eaBibieWU6Z9cD-p4VaRzC80OxM00uGYbJ9mmT7kuFBiJWGFvCWi89f055opVjC6WizcmYzndJ5q-fC4I27I-fWopaVq1_vrZyVa8L0L9FZwp9hpVi-VAXcGXhxAC-g1oLq_s7bzMDfuRW_whRTBb_-hCq6eWlrAwK7GtBCr4fnq4Ym0TrgnhONnBseqc8UuQSNN8Qu5xmXLDxFNdsslUTXfukaUTkhiuHGJp9FmTPKv3z0g3A2ui4RmUgSynWvaotOxfEaqghoAuJjUIPx84eUo_yGEhpA39QrmZ0bGnQhjvSzQJY2bNwRA"

    this.adal.getContext.acquireToken(envConfig.endpoints, (message, token) => {
      console.log("Error Message API: " + message);
      console.log("Token : " + token);
      console.log("PNS Api AccessToken : " + envConfig.resource);
      this.graphToken = token;
  });

    this.adal.getContext.acquireToken(envConfig.resource, (message, token) => {
      console.log("Error Message API: " + message);
      console.log("Token : " + token);
      console.log("PNS Api AccessToken : " + envConfig.resource);
      this.tokenVal = token;
  });

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
if(request.url && request.url.includes("graph.microsoft.com")){
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.graphToken
      }
    
    });
  }
  else{
    // if(!this.tokenVal)
    // this.tokenVal=localStorage.getItem("authToken");
    
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.tokenVal
      }
    
    });
  }
    return next.handle(request).pipe(
      map((data, rr) => {
        return data;
      }),
     
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.loader.hide();
          if(err.url.includes('photo/$value'))
          {
            
          }
          else
          this.toasterService.show('An error occurred');
          //log error 
        }
        return of(err);
      })
    );

  }
}