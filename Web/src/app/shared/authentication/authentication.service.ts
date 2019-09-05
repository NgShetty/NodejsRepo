import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Users/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // user = new user();
  userRole: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(this.getUserRole());
  userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(this.getUser());

  constructor(private _router: Router,private userService: UserService) { }

  getUserRole() : number[] {
    let userRoles=[];
    if(localStorage.getItem('userRole'))
    {
    return JSON.parse(localStorage.getItem('userRole'));
    }
    else
    {
    return [];
    }
  }

  setUser(user,userRole:number[]) {
    if(this.userProfile){
    this.userProfile.next(user);
    localStorage.setItem('userProfile',JSON.stringify(user));
    }

    if(this.userRole){
    this.userRole.next(userRole);
    localStorage.setItem('userRole',JSON.stringify(userRole));
    }
  }

  getUser()
  {
    if(localStorage.getItem('userProfile'))
    {
    return  JSON.parse(localStorage.getItem('userProfile'));
    }
    else
    {
    return {};
    }
  }
  setTenantIds(allTenantIds:any[]) {
    localStorage.setItem('allTenantIds',JSON.stringify(allTenantIds));
  }
  getTenantIds() {
    if(localStorage.getItem('allTenantIds') && JSON.parse(localStorage.getItem('allTenantIds')))
    return JSON.parse(localStorage.getItem('allTenantIds')).join(',');
  }
  setApplicationIds(allAppIds:any[]) {
    localStorage.setItem('allAppIds',JSON.stringify(allAppIds));
  }
  getApplicationIds() {
    if(localStorage.getItem('allAppIds') && JSON.parse(localStorage.getItem('allAppIds')))
    return JSON.parse(localStorage.getItem('allAppIds')).join(',');
  }
  resetUser()
  {
    localStorage.clear();
  }

}
