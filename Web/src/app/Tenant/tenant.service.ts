import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddTenant } from './_models/addTenant';
import { EditTenant } from './_models/editTenant';
import { CommonService } from '../shared/services/common.service';
import { TenantListItem } from './_models/tenantList';
import { AuthenticationService } from '../shared/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class TenantService {
  tenantIDs: string;
  restServiceURI: string;
  constructor(private http: HttpClient, private _commonService: CommonService, private authService: AuthenticationService) {
    //uncomment before deploying
         this.restServiceURI = _commonService.corsURL;
    //comment before deploying
    //   this.restServiceURI = "http://localhost:62656" + "/tenant";
    //   console.log(this.authService.getTenantIds());
    //   this.tenantIDs=this.authService.getTenantIds();
    //  if(!this.tenantIDs)
     this.tenantIDs="all";
  }

  getTenantList() {
    if(this.tenantIDs)
    return this.http.get(`${this.restServiceURI}`);
    else
    return this.http.get(`${this.restServiceURI}/${this.tenantIDs}`);
  }
  getAllTenantList(pageNumber: number,filedName: string, fieldOrder: string,pageSize: number,keyword:string) {
    if(keyword)
    keyword="&&keyword="+keyword
    else
    keyword="";
    return this.http.get(`${this.restServiceURI}?pageNumber=${pageNumber}&&sortField=${filedName}&isAscendingSort=${fieldOrder}&&pageSize=${pageSize}${keyword}`);
  }

  getTenantListByPageNumber(pageNumber: number) {
    return this.http.get(`${this.restServiceURI}?pageNumber=${pageNumber}`);
  }

  getTenantsBySort(filedName: string, fieldOrder: string) {
    return this.http.get(`${this.restServiceURI }?sortField=${filedName}&isAscendingSort=${fieldOrder}`);
  }

  getTenantListByPageSize(pageSize: number) {
    if(!pageSize)
    pageSize=2147483645;
    return this.http.get(`${this.restServiceURI }?pageSize=${pageSize}`);
  }
  // getTenantListOnSearch(searchText:number)
  // {
  //   return this.http.get(`${this.restServiceURI}/tenant?keyword=${searchText}`);
  // }
  getTenantById(guid: any) {
    return this.http.get<TenantListItem>(`${this.restServiceURI}/${guid}`)
  }

  createTenant(tenantObj: AddTenant) {
    return this.http.post<AddTenant>(`${this.restServiceURI}`, tenantObj);
  }

  save(guid: any, tenantObj: EditTenant) {
    return this.http.put<EditTenant>(`${this.restServiceURI}/${guid}`, tenantObj);
  }

  deleteTenant(guid: String) {
    return this.http.delete(`${this.restServiceURI}/${guid}`)
  }

}
