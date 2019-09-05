import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationDTO } from './_models/createApplication';
import { EditApplicationDTO } from './_models/editApplication';
import { CommonService } from '../shared/services/common.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class ApplicationService {
  attr: any;
  tenantIDs: string;
  restServiceURI: string;
  appIds: string;
  constructor(private http: HttpClient, private _commonService: CommonService, private authService : AuthenticationService) {

    //uncomment before deploying
       this.attr = "/apppool/all/appentry";
       this.restServiceURI = _commonService.corsURL + "/"

    //comment before deploying
     //this.attr = "/apppool/all/appentry";
     //this.restServiceURI = "http://localhost:51888/tenant/";

      // this.tenantIDs=this.authService.getTenantIds();
      if(!this.tenantIDs)
      this.tenantIDs="all";

      // this.appIds=this.authService.getApplicationIds();
      if(!this.appIds)
      this.appIds="all";

  }

  getApplicationList(selectedTenantId) {
    if(!selectedTenantId)
    selectedTenantId="all";
    return this.http.get(`${this.restServiceURI + selectedTenantId + this.attr}`);

    // return this.http.get(`${this.restServiceURI}/application`).pipe(
    //   map((appDetails: any) => {
    //     return appDetails.data.items;
    //   }));

    // return this.http.get(`/${this.restServiceURI}/application`);
  }
  getAllApplicationList(selectedTenantId,pageNumber: number,filedName: string, fieldOrder: string,pageSize: number,keyword:String) {
    if(!selectedTenantId)
    selectedTenantId="all";
    if(keyword)
    keyword="&&keyword="+keyword
    else
    keyword="";
    return this.http.get(`${this.restServiceURI + selectedTenantId + this.attr}?pageNumber=${pageNumber}&&sortField=${filedName}&isAscendingSort=${fieldOrder}&&pageSize=${pageSize}${keyword}`);
  }
  createApplication(applicationObj: ApplicationDTO) {
    //return this.http.post<CreateApplication>(`/${this.restServiceURI}/application`, applicationObj);  
    return this.http.post<ApplicationDTO>(`${this.restServiceURI + this.tenantIDs + this.attr}`, applicationObj);
  }

  saveApplication(guid: any, applicationObj: EditApplicationDTO) {
    return this.http.put<EditApplicationDTO>(`${this.restServiceURI + this.tenantIDs + "/apppool/all/appentry"}/${guid}`, applicationObj);
  }

  getApplicationListByPageNumber(selectedTenantId:any, pageNumber: number) {
    if(!selectedTenantId)
    selectedTenantId="all";
    return this.http.get(`${this.restServiceURI + selectedTenantId + this.attr}?pageNumber=${pageNumber}`);
  }

  getApplicationListByPageSize(selectedTenantId: any, pageSize: number) {
    if(!selectedTenantId)
    selectedTenantId="all";
    if(!pageSize)
    pageSize=2147483645;
    return this.http.get(`${this.restServiceURI + selectedTenantId + this.attr}?pageSize=${pageSize}`);
  }

  getApplicationListByTenantId(selectedTenantId: any) {
    if(!selectedTenantId)
    selectedTenantId="all";
    return this.http.get(`${this.restServiceURI + selectedTenantId + this.attr}`);
  }

  getApplicationById(guid: any) {
    return this.http.get(`${this.restServiceURI + this.tenantIDs + "/apppool/all/appentry"}/${guid}`)
  }

  getApplicationBySort(selectedTenantId:any, filedName: string, fieldOrder: string) {
    if(!selectedTenantId)
    selectedTenantId="all";
    return this.http.get(`${this.restServiceURI + selectedTenantId + this.attr}?sortField=${filedName}&isAscendingSort=${fieldOrder}`);
  }

  deleteApplication(guid: String) {
    return this.http.delete(`${this.restServiceURI + this.tenantIDs + "/apppool/all/appentry"}/${guid}`)
  }

}
