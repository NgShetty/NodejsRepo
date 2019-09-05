import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  //region construtor
  private _corsURL: string;
  private _application: string = "appentry";
  private _notification: string = "notification";
  private _fileUpload: string = "upload";
  private _device: string = "device";
  private _topic: string = "topic";
  private _user: string = "user";
  private _appPool:string="apppool";
  private _tenant: string="tenant";
  private _graphResource: string="";
  private _reports:string="reports";

  environment: string;
  constructor() {
    var envConfig = new EnvService();
    this._corsURL = envConfig.rootUri;
    this._graphResource=envConfig.endpoints+"/v1.0";

  }
  public set corsURL(val: string) {
    if (val != "") {
      this._corsURL = val;
    }
  }
  public get corsURL() {
    return this._corsURL;
  }

  public get graphResource() {
    return this._graphResource;
  }
  
  public get appPool() {
    return this._appPool;
  }

  public set appPool(val: string) {
    if (val != "") {
      this._appPool = val;
    }
  }

  public get tenant() {
    return this._tenant;
  }

  public set tenant(val: string) {
    if (val != "") {
      this._tenant = val;
    }
  }

  public get application() {
    return this._application;
  }

  public set application(val: string) {
    if (val != "") {
      this._application = val;
    }
  }
  
  public get notification() {
    return this._notification;
  }

  public set notification(val: string) {
    if (val != "") {
      this._notification = val;
    }
  }
  public get device():string {
    return  this._device;
  }

  
  public get fileUpload() {
    return this._fileUpload;
  }

  public set fileUpload(val: string) {
    if (val != "") {
      this._fileUpload = val;
    }
  }
  public get topic() {
    return this._topic;
  }

  public set topic(val: string) {
    if (val != "") {
      this._topic = val;
    }
  }
  public get user() {
    return this._user;
  }

  public set user(val: string) {
    if (val != "") {
      this._user = val;
    }
  }
  public get reports() {
    return this._reports;
  }
}
