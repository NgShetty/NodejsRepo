import { Component, OnInit } from '@angular/core';
import { AdalService } from './shared/services/adal.service';
import { LoaderService } from './shared/loader/loader.service';
import { UserService } from './Users/user.service';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './shared/authentication/authentication.service';
import { Roles } from './Users/_models/user';
import { EnvService } from './shared/services/env.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Deloitte Mobile Web PNS2.0';
  loadComponents: boolean = false;
  userRole: string = '';
  userName: string;
  getrolecontext: any;

  constructor(private adal: AdalService, private loader: LoaderService, private userService: UserService, private authService: AuthenticationService, private router: Router) {
    document.body.scrollTop = 0;
 
    try {
          this.adal.checkAuth();
          this.getrolecontext = this.adal.getContext;
    }
    catch(ex){

    } 
        
  }

  ngOnInit() {
      if (this.getrolecontext._user.userName && !this.getrolecontext._loginInProgress) {
        this.getUserProfile(this.getrolecontext._user.userName);

  //remove this after authorization is completely functional
    //  this.authService.resetUser();
    //  this.authService.setUser(null,[0]);
    //  this.loadComponents = true;
    //  this.authService.setTenantIds([]);
    //  this.authService.setApplicationIds([]);

      }
      else {
        this.loadComponents = false;
        this.adal.login();
      }
    
    
  }

  getUserProfile(userName)
  {
    this.userService.getUserInfo("userProfile",userName,1).subscribe((value:any) => { 
      var userProfile = value.data;
      this.authService.resetUser();
    // this.authService.setUser(null,0);
      let loggedInUserRoles = [];
      let allTenantsAssigned =[];
      let allAppsAssigned=[];
      if(userProfile.systemRole)
      {
        if(userProfile.systemRole.systemRoleType==0)
        loggedInUserRoles.push(Roles.SystemAdmin);
      else if(userProfile.systemRole.systemRoleType==1)
        loggedInUserRoles.push(Roles.SystemReader);
      }
       if(userProfile.tenantRoles && userProfile.tenantRoles.length>0)
      {
        userProfile.tenantRoles.forEach(element => {
          if(element.tenantRoleType==0){
          loggedInUserRoles.push(Roles.TenantOwner);
          allTenantsAssigned.push(element.tenant.id);
          }
          if(element.tenantRoleType==1){
          loggedInUserRoles.push(Roles.TenantReader);
          allTenantsAssigned.push(element.tenant.id);
          }
        });
      }
       if(userProfile.applicationRoles && userProfile.applicationRoles.length>0)
      {
        userProfile.applicationRoles.forEach(item => {
          item.associatedApplicationRoles.forEach(element => {
            if(element.applicationRoleType==0){
            loggedInUserRoles.push(Roles.AppOwner);
            allAppsAssigned.push(element.application.id);
            }
            if(element.applicationRoleType==1){
            loggedInUserRoles.push(Roles.AppReader);
            allAppsAssigned.push(element.application.id);
            }
            if(element.applicationRoleType==2){
            loggedInUserRoles.push(Roles.AppNotificationOwner);
            allAppsAssigned.push(element.application.id);
            }
          });
        });
      }
      loggedInUserRoles = loggedInUserRoles.filter((el, i, a) => i === a.indexOf(el))
      this.authService.setUser(userProfile,loggedInUserRoles);
      this.authService.setTenantIds(allTenantsAssigned);
      this.authService.setApplicationIds(allAppsAssigned);
     this.loadComponents = true;
     this.router.navigate(["dashboard"]);
    });
  }

}
