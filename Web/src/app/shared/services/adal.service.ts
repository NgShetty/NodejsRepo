import { Injectable } from '@angular/core';
import { } from 'adal';
import { Observable, Subscriber } from 'rxjs';
import { EnvService } from './env.service';


@Injectable()
export class AdalService {

  private context: adal.AuthenticationContext;
  private _config: adal.Config;

  constructor() {
    var envConfig = new EnvService();
    this._config = {
      tenant : envConfig.tenant,
      clientId : envConfig.clientId,
      postLogoutRedirectUri : window.location.origin,
      cacheLocation : "localStorage",
      redirectUri : envConfig.redirectUri,
      resource : envConfig.resource,
      endpoints : envConfig.endpoints
    };
    this.context = new AuthenticationContext(this._config);
  }

  public checkAuth(): void {
    this.context.handleWindowCallback();
    if (!this.isLogged) {
      this.context.login();
    }
  }

  login() {

    this.context.login();

  }

  logout() {

    this.context.logOut();

  }

  handleCallback() {

    this.context.handleWindowCallback();

  }

  public get userInfo() {

    return this.context.getCachedUser();

  }

  public get accessToken() {

    return this.context.getCachedToken(this._config.clientId);

  }


  public get isAuthenticated() {

    return this.userInfo && this.accessToken;

  }

  public get getContext(): adal.AuthenticationContext {
    return this.context;
  }
  public get isLogged(): boolean {
    const user = this.context.getCachedUser();
    const token = this.context.getCachedToken(this._config.clientId);
    return !!user && !!token;
  }

  public acquireToken(resource: string): Observable<any> {
    return new Observable<any>((subscriber: Subscriber<any>) =>
      this.context.acquireToken(resource, (message: string, token: string) => {
        subscriber.next(token);
      })
    );
  }

}
