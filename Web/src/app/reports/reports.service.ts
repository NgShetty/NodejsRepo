import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/services/common.service';
import { ReportRequestBody } from './models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  restServiceURI:string;
  
  constructor(private http: HttpClient, private _commonService: CommonService) { 
        this.restServiceURI = _commonService.corsURL;
      //this.restServiceURI="http://localhost:51889";
  }

  getactiveDevicesReport(filteredPayload: any) {
    return this.http.post<ReportRequestBody>(`${this.restServiceURI}/${this._commonService.reports}/activeDevices`,filteredPayload);
  }
  getTotalTopicsReport(filteredPayload: any){
    return this.http.post<ReportRequestBody>(`${this.restServiceURI}/${this._commonService.reports}/topTopics`,filteredPayload);
  }
  getTotalNotificationsReport(notificationId:any,selectedDate:any)
  {
    return this.http.get(`${this.restServiceURI}/${this._commonService.reports}/notification?notificationId=${notificationId}&selectedDate=${selectedDate}`);
  }
}
