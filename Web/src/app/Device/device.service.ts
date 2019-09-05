import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceDTO } from './_models/device';
import { CommonService } from '../shared/services/common.service';
import { id } from '@swimlane/ngx-datatable/release/utils';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  attr: any;
  tenantId: any;
  restServiceURI: string;
  damigui:string;

  constructor(private http: HttpClient,  private _commonService: CommonService) {

    this.restServiceURI =  _commonService.corsURL;

    //this.restServiceURI = "http://localhost:62653/tenant";
    this.damigui="e787568c-0916-48fb-bee0-de5a44c321c5";
  }

  getAllDeviceList(tenantId,pageNumber: number,filedName: string, fieldOrder: string,pageSize: number,keyWord:string) {
    if(!tenantId)
    tenantId="all"
    if(keyWord)
    keyWord="&&keyword="+keyWord
    else
    keyWord="";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/${this.damigui}/${this._commonService.application}/${this.damigui}/${this._commonService.device}?pageNumber=${pageNumber}&&sortField=${filedName}&isAscendingSort=${fieldOrder}&&pageSize=${pageSize}${keyWord}`);
  }

  getDeviceListByPageSize(pageSize: number,tenantId) {
    if(!tenantId)
    tenantId="all"
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/${this.damigui}/${this._commonService.application}/${this.damigui}/${this._commonService.device}?pageSize=${pageSize}`);
  }

  getDeviceListByPageNumber(pageNumber: number,tenantId) {
    if(!tenantId)
    tenantId="all"
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/${this.damigui}/${this._commonService.application}/${this.damigui}/${this._commonService.device}?pageNumber=${pageNumber}`);
  }

  getDeviceBySort(filedName: string, fieldOrder: string,tenantId) {
    if(!tenantId)
    tenantId="all"
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/${this.damigui}/${this._commonService.application}/${this.damigui}/${this._commonService.device}?sortField=${filedName}&isAscendingSort=${fieldOrder}`);
  }
  save(Id: any, deviceObj: DeviceDTO) {
    return this.http.put<DeviceDTO>(`${this.restServiceURI}/${deviceObj.associatedApplication.application.associatedTenant.tenant.id}/${this._commonService.appPool}/${deviceObj.associatedApplication.application.associatedTenant.tenant.appPoolsAllocated[0].appPool.id}/${this._commonService.application}/${deviceObj.associatedApplication.application.id}/${this._commonService.device}`+"/" + Id, deviceObj);
  }

  deleteDevice(Id: string,deviceObj: DeviceDTO) {
    return this.http.delete(`${this.restServiceURI}/${deviceObj.associatedApplication.application.associatedTenant.tenant.id}/${this._commonService.appPool}/${deviceObj.associatedApplication.application.associatedTenant.tenant.appPoolsAllocated[0].appPool.id}/${this._commonService.application}/${deviceObj.associatedApplication.application.id}/${this._commonService.device}/${Id}`)
  }


}
