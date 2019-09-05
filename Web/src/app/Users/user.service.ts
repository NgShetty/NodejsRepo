import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDTO, SystemUser, TenantUser, AppUser, User } from './_models/user';
import { CommonModule } from '@angular/common';
import { CommonService } from '../shared/services/common.service';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tenantId:any;
  restServiceURI: string;
  
  constructor(private http: HttpClient, private _commonService: CommonService, private sanitizer: DomSanitizer) {

        this.restServiceURI = _commonService.corsURL.replace("/tenant","");

   // this.restServiceURI = "http://localhost:62656";
    
  }
  getAllusersList(tenantId:any,pageSize: number, attr: string, roleID: number,pageNumber: number,filedName: string, sortOrder: string,){
    if(tenantId=="0" || tenantId==null || tenantId=="")
    tenantId="all";
    if(attr=="applicationUser" || attr=="tenantUser")
    return this.http.get(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}?roleType=${roleID}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${filedName}&sortDirection=${sortOrder}`);
    else if(attr=="systemUser")
    return this.http.get(`${this.restServiceURI}/${attr}?roleType=${roleID}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${filedName}&sortDirection=${sortOrder}`);
  }

  getUserList(attr: string, roleID: number, tenantId:any) {
    if(tenantId=="0" || tenantId==null || tenantId=="")
    tenantId="all";
    if(attr=="applicationUser" || attr=="tenantUser")
    return this.http.get(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}?roleType=${roleID}`);
    else if(attr=="systemUser")
    return this.http.get(`${this.restServiceURI}/${attr}?roleType=${roleID}`);
  }

  getUserListByPageSize(tenantId:any,pageSize: number, attr: string, roleID: number) {
    if(tenantId=="0" || tenantId==null || tenantId=="")
    tenantId="all";
    if(attr=="applicationUser" || attr=="tenantUser")
    return this.http.get(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}?pageSize=${pageSize}&roleType=${roleID}`);
    else if(attr=="systemUser")
    return this.http.get(`${this.restServiceURI}/${attr}?pageSize=${pageSize}&roleType=${roleID}`);
  }

  getUserListByPageNumber(tenantId:any,pageNumber: number, attr: string, roleID: number) {
    if(tenantId=="0" || tenantId==null || tenantId=="")
    tenantId="all";
    if(attr=="applicationUser" || attr=="tenantUser")
    return this.http.get(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}?pageNumber=${pageNumber}&roleType=${roleID}`);
    else if(attr=="systemUser")
    return this.http.get(`${this.restServiceURI}/${attr}?pageNumber=${pageNumber}&roleType=${roleID}`);
  }

  getUserBySort(tenantId:any,filedName: string, fieldOrder: string, attr: string, roleID: number) {
    if(tenantId=="0" || tenantId==null || tenantId=="")
    tenantId="all";
    if(attr=="applicationUser" || attr=="tenantUser")
    return this.http.get(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}?sortField=${filedName}&sortDirection=${fieldOrder}&roleType=${roleID}`);
    else if(attr=="systemUser")
    return this.http.get(`${this.restServiceURI}/${attr}?sortField=${filedName}&sortDirection=${fieldOrder}&roleType=${roleID}`);
  }

  getUserInfo(attr: string, userName: string,profiletype:number) {
    return this.http.get(`${this.restServiceURI}/${attr}?userid=${userName}&profiletype=${profiletype}`);
  }

  createSysUsers(users: SystemUser[], attr: string, roleID:number) {
    return this.http.post<SystemUser[]>(`${this.restServiceURI}/${attr}?roleType=${roleID}`, users);
  }
  
  createTenantUsers(users: User[], attr: string, tenantId:any, roleID:number) {
    return this.http.post<TenantUser[]>(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}?roleType=${roleID}`, users);
  }

  createAppUsers(users: AppUser[], attr: string,tenantId: string,appentryId:string) {
    return this.http.post<AppUser[]>(`${this.restServiceURI}/${this._commonService.tenant}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/${appentryId}/${attr}?tenantId=${tenantId}&&appentryId=${appentryId}`, users);
  }

  unassignUser(Id: string, attr: string, appOrTenantId:number,roleID:number) {
    if(attr=="systemUser")
    return this.http.delete(`${this.restServiceURI}/${attr}/${Id}?roleType=${roleID}`)
    if(attr=="tenantUser")
    return this.http.delete(`${this.restServiceURI}/${this._commonService.tenant}/${appOrTenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${attr}/${Id}?roleType=${roleID}`)
    else if(attr=="applicationUser")
    return this.http.delete(`${this.restServiceURI}/${this._commonService.tenant}/all/${this._commonService.appPool}/all/${this._commonService.application}/${appOrTenantId}/${attr}/${Id}?appId=${appOrTenantId}&roleType=${roleID}`)
  }

  searchUsers(searchText: string,tenantId:any,appId:any,userType:number)
  {
    if(!appId)
    appId="all";
    if(!tenantId)
    tenantId="all";
    if(userType==0)
    return this.http.get(`${this.restServiceURI}/searchuser?searchstring=${searchText}&usertype=${userType}`);
    else if(userType==1)
    return this.http.get(`${this.restServiceURI}/searchuser?searchstring=${searchText}&tenantid=${tenantId}&usertype=${userType}`);
    else if(userType==2)
    return this.http.get(`${this.restServiceURI}/searchuser?searchstring=${searchText}&tenantid=${tenantId}&appentryid=${appId}&usertype=${userType}`);
    }

    searchUsersFromDb(searchText: string)
    {
    return this.http.get(`${this.restServiceURI}/searchuser/local?searchstring=${searchText}`);
    }

    getUserImage(imageUrl : string):any {
      return this.http.get(
        `${imageUrl}`,
        { observe: 'response', responseType: 'blob' });
    }

      
    getUsersFromGraph(searchText:string)
    {
      let graphAttr="/users";
      return this.http.get(`${this._commonService.graphResource}${graphAttr}?$filter=startswith(mail%2C+'${searchText}') or startswith(displayName%2C+'${searchText}')&$top=10`);
    }
    

    
}
