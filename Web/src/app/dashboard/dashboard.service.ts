import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/services/common.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { NotificationStatus } from './_models/dashboard';
import {ReportRequestBody} from './_models/dashboard'
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  attr: any;
  tenantIDs: string;
  restServiceURI: string;
  appIds: string;
  constructor(private http: HttpClient, private _commonService: CommonService, private authService : AuthenticationService) { 
    //uncomment before deploying
    this.attr = "dashboard";
    this.restServiceURI = _commonService.corsURL + "/"

 //comment before deploying
 // this.attr =  "dashboard";
  //this.restServiceURI = "http://localhost:51889/dashboard";

   // this.tenantIDs=this.authService.getTenantIds();
   if(!this.tenantIDs)
   this.tenantIDs="all";

   // this.appIds=this.authService.getApplicationIds();
   if(!this.appIds)
   this.appIds="all";
  }
  getNotificationDashBoard(objReportRequestBody: ReportRequestBody) {
    return this.http.post<ReportRequestBody>(`${this.restServiceURI}`, objReportRequestBody);
  }
}
