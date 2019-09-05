import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddTopic, EditTopic } from './_models/Topics';
import { CommonService } from '../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  // tenantId:any;
  restServiceURI: string;
  appPoolAttr: any;
  appEntryAttr: any;
  serviceTempUri:string;
  topicRoute: string;
  constructor(private http: HttpClient, private _commonService: CommonService) {

    
        this.restServiceURI = _commonService.corsURL;
     this.serviceTempUri = _commonService.corsURL+ "/all";;
      //this.topicRoute="/apppool/all/appentry/210a5134-c305-4e43-b63e-a70a96ab754d/topic";

    this.appPoolAttr="apppool/all";
    this.appEntryAttr="appentry";
   // this.serviceTempUri="http://localhost:63591/tenant/all";
    //this.restServiceURI = "http://localhost:63591" + "/tenant";
    this.topicRoute="topic";
  }
  
  getAllTopicList(tenantId: any, appID:any,pageNumber: number,filedName: string, sortOrder: string,pageSize: number) {
    if(tenantId=="0" || tenantId==null)
    tenantId="all";
    appID="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this.appPoolAttr}/${this.appEntryAttr}/${appID}/${this.topicRoute}?pageNumber=${pageNumber}&&sortField=${filedName}&isAscendingSort=${sortOrder}&&pageSize=${pageSize}`);
  }

  getTopicList(tenantId: any, appID:any) {
    if(tenantId=="0" || tenantId==null)
    tenantId="all";
    appID="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this.appPoolAttr}/${this.appEntryAttr}/${appID}/${this.topicRoute}`);
  }
 
  getTopicListByPageSize(tenantId: any,pageSize: number) {
    if(tenantId=="0" || tenantId==null)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this.appPoolAttr}/${this.appEntryAttr}/all/${this.topicRoute}?pageSize=${pageSize}`);
  }

  getTopicListByPageNumber(tenantId: any,pageNumber: number) {
    if(tenantId=="0" || tenantId==null)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this.appPoolAttr}/${this.appEntryAttr}/all/${this.topicRoute}?pageNumber=${pageNumber}`);
  }

  getTopicBySort(tenantId: any,filedName: string, fieldOrder: string) {
    if(tenantId=="0" || tenantId==null)
    tenantId="all";
    return this.http.get(`${this.restServiceURI}/${tenantId}/${this.appPoolAttr}/${this.appEntryAttr}/all/${this.topicRoute}?sortField=${filedName}&isAscendingSort=${fieldOrder}`);
  }
  save(Id: any, topicObj: EditTopic, associatedAppId: any) {
    return this.http.put<EditTopic>(`${this.restServiceURI}/all/${this.appPoolAttr}/${this.appEntryAttr}/${associatedAppId}/${this.topicRoute}/${Id}`, topicObj);
  }
  create(topicObj: AddTopic, associatedAppId: any) {
    return this.http.post<AddTopic>(`${this.restServiceURI}/all/${this.appPoolAttr}/${this.appEntryAttr}/${associatedAppId}/${this.topicRoute}`, topicObj);
  }
  deleteTopic(Id: string, associatedAppId: any) {
    return this.http.delete(`${this.restServiceURI}/all/${this.appPoolAttr}/${this.appEntryAttr}/${associatedAppId}/${this.topicRoute}/${Id}`)
  }
  getSecurityGroups(resourceUri)
  {
    return this.http.get(`${resourceUri}`);
  }
  searchTopics(searchText:string,tenantId:any,appId:any,recipientTypes:number[])
  {
    if(!tenantId)
    tenantId="all";
    if(!appId)
    appId="all";
    return this.http.post(`${this.restServiceURI}/${tenantId}/${this._commonService.appPool}/all/${this._commonService.application}/${appId}/${this._commonService.topic}/search?keyword=${searchText}`,recipientTypes);
  }
}
