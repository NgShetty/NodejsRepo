import { Injectable } from '@angular/core';
import { AppPoolAdd } from './_models/app-pool-details';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AppPoolServiceService {
  id: any
  restServiceURI: string;
  constructor(private http: HttpClient, private _commonService: CommonService) {


    //uncomment before deploying
    this.id = "all/apppool";
    this.restServiceURI = _commonService.corsURL + "/" + this.id;

    //comment before deploying
    // this.id="/tenant/all/apppool";
    // this.restServiceURI= "https://localhost:44339" + this.id;

  }

  getAppPoolList() {
    return this.http.get(`${this.restServiceURI}`).pipe(
      map((appPoolDetails: any) => {
        return appPoolDetails.data;
      }));
  }

  getTenantsList(appPoolId: any) {
    return this.http.get(`${this.restServiceURI}/${appPoolId}`).pipe(
      map((tenantList: any) => {
        return tenantList.data;
      }));
  }
  createAppPool(appPoolObj: AppPoolAdd) {
    return this.http.post<AppPoolAdd>(`${this.restServiceURI}`, appPoolObj);
  }

  save(appPoolId: any, appPoolObj: AppPoolAdd) {
    return this.http.put<AppPoolAdd>(`${this.restServiceURI}/${appPoolId}`, appPoolObj);
  }

  deleteAppPool(Id: String) {
    return this.http.delete(`${this.restServiceURI}/${Id}`)
  }
}
