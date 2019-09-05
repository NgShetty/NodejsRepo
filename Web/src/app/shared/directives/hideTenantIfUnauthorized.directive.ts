import { Directive, ElementRef, OnInit, Input, SystemJsNgModuleLoader } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Roles, TenantRoleType } from 'src/app/Users/_models/user';

@Directive({
    selector: '[hideIfUnauthorizedTenant]'
})
export class HideIfUnauthorizedTenant implements OnInit {
    @Input('hideIfUnauthorizedTenant') permission: any[]; // Required permission passed in
    @Input('tenantId') tenantId: any;
    currentUserRole: any[] = [];
    userProfile: any;
    constructor(private el: ElementRef, private authService: AuthenticationService) { }

    ngOnInit() {
        // let currentUserRole;
        this.authService.userProfile.subscribe((data) => {
            this.userProfile=data;
        });
        this.authService.userRole.subscribe((data) => {
            this.currentUserRole = data;
            if (this.currentUserRole && this.currentUserRole.length > 0 && this.currentUserRole.indexOf(Roles.SystemAdmin) === -1) {
                if (this.permission && this.permission.length > 0) {
                    let hideElement=false;
                    for(let element of this.currentUserRole){
                        if (this.permission.indexOf(element) === -1) {
                            // this.el.nativeElement.style.display = 'none';
                            hideElement=true;
                            this.el.nativeElement.style.display = 'none';
                        }
                        else if(this.tenantId) {
                            hideElement=false;
                         if((element==Roles.TenantOwner || element==Roles.TenantReader) && this.tenantId)
                         {
                            this.authService.userProfile.subscribe((data) => {
                                this.userProfile=data;
                                if(this.userProfile.tenantRoles && this.userProfile.tenantRoles.length>0)
                                {
                                    let tenantExists=false;
                                    for(let obj of this.userProfile.tenantRoles) {
                                        if(this.tenantId==obj.tenant.id)
                                        { 
                                            tenantExists=true;
                                        if(obj.tenantRoleType!=TenantRoleType.tenantOwner){
                                        // this.el.nativeElement.style.display = 'none';
                                        hideElement=true;
                                        this.el.nativeElement.style.display = 'none';
                                        }
                                        else
                                        break;
                                    }
                                        
                                    
                                    }
                                    if(!tenantExists){
                                    //check if the tenant exists in applications associated with user
                                    for(let objTenant of this.userProfile.applicationRoles){
                                        if(this.tenantId=objTenant.tenant.id)
                                        {
                                            hideElement=true;
                                            break
                                        }
                                     }
                                    }
                                }
                            });
                         }
                         else if((element==Roles.TenantOwner || element==Roles.TenantReader) && this.tenantId)
                         {
                            // this.el.nativeElement.style.display = '';
                            hideElement=false;
                         }
                         else if(element==Roles.SystemReader){
                        //  this.el.nativeElement.style.display = 'none';
                         hideElement=true;
                         this.el.nativeElement.style.display = 'none';
                         }
                        //  else if((element==Roles.AppOwner || element==Roles.AppReader || element==Roles.AppNotificationOwner) && this.tenantId)
                        
                        }
                       
                        if(!hideElement)
                        break;
                    }
                    if(hideElement)
                    this.el.nativeElement.style.display = 'none';
                    else
                    this.el.nativeElement.style.display = '';
                }
            }

        });

    }
}