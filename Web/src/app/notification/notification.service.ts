import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationAdd, NotificationEdit } from './_models/notification-details';
import { CommonService } from '../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationId: any;
  restServiceURI: string;
  constructor(private http: HttpClient, private _commonService: CommonService) {
       this.notificationId = "/apppool/all/appentry/all/notification";
       this.restServiceURI = _commonService.corsURL;

    //this.notificationId = "/apppool/all/appentry/all/notification";
    //this.restServiceURI = "http://localhost:63592/tenant";
  }

  getAllNotificationList(tenantId:any,appId:any, isScheduled: boolean,pageNumber: number,fieldName: string, sortOrder: string,pageSize: number,keyWord:string) {
    if(!tenantId)
    tenantId="all";
    if(!appId)
    appId="all";
    if(keyWord)
    keyWord="&&keyword="+keyWord
    else
    keyWord="";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/${appId}/${this._commonService.notification}?pageNumber=${pageNumber}&&sortField=${fieldName}&isAscendingSort=${sortOrder}&&pageSize=${pageSize}&&isScheduled=${isScheduled}${keyWord}`);
  }

  createNotification(tenantId:any, notificationObj: NotificationAdd, appId:any) {
    if(!tenantId)
    tenantId="all";
    return this.http.post<NotificationAdd>(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/03c43a80-31ee-4269-9941-aac3a8ea1604/${this._commonService.application}/${appId}/${this._commonService.notification}`, notificationObj);
  }

  getNotificationsList(tenantId:any,appId:any, isScheduled: boolean) {
    if(!tenantId)
    tenantId="all";
    if(!appId)
    appId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/${appId}/${this._commonService.notification}?isScheduled=${isScheduled}`);
  }

  getNotificationsListByPageSize(tenantId:any, pageSize: number) {
    if(!tenantId)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${this._commonService.notification}?pageSize=${pageSize}`);
  }

  getNotificationsListByPageNumber(tenantId:any, pageNumber: number) {
    if(!tenantId)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${this._commonService.notification}?pageNumber=${pageNumber}`);
  }

  getNotificationsBySort(tenantId:any, filedName: string, fieldOrder: string) {
    if(!tenantId)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/all/${this._commonService.notification}?sortField=${filedName}&isAscendingSort=${fieldOrder}`);
  }

  getNotificationsListById(tenantId:any, id:any)
  {
    if(!tenantId)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/03c43a80-31ee-4269-9941-aac3a8ea1604/${this._commonService.application}/03c43a80-31ee-4269-9941-aac3a8ea1604/${this._commonService.notification}/${id}`);
  }

  save(tenantId:any, Id: any, notificationObj: NotificationEdit,appId:any) {
    if(!tenantId)
    tenantId="all";
    return this.http.put<NotificationEdit>(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/03c43a80-31ee-4269-9941-aac3a8ea1604/${this._commonService.application}/${appId}/${this._commonService.notification}/${Id}`, notificationObj);
  }

  deleteNotification(tenantId:any, Id: string) {
    if(!tenantId)
    tenantId="all";
    return this.http.delete(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/03c43a80-31ee-4269-9941-aac3a8ea1604/${this._commonService.application}/03c43a80-31ee-4269-9941-aac3a8ea1604/${this._commonService.notification}/${Id}`)
  }

  searchRecipients(searchText:string)
  {
    return this.http.get(`${this.restServiceURI}/all/${this._commonService.appPool}/all/${this._commonService.application}/all/${this._commonService.notification}?searchText=${searchText}`);
  }
}
