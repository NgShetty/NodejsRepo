import { Directive, ElementRef, OnInit, Input, SystemJsNgModuleLoader } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Roles, TenantRoleType, ApplicationRoleType } from 'src/app/Users/_models/user';

@Directive({
    selector: '[hideIfUnauthorizedApp]'
})
export class HideIfUnauthorizedApp implements OnInit {
    @Input('hideIfUnauthorizedApp') permission: any[]; // Required permission passed in
    @Input('appId') appId: any;
    @Input('tenantId') tenantId: any;
    @Input('notificationId') notificationId: any;
    @Input('isDisable') disable: boolean;
    currentUserRole: any[] = [];
    userProfile: any;
    constructor(private el: ElementRef, private authService: AuthenticationService) { }

    ngOnInit() {
        // let currentUserRole;
        this.authService.userProfile.subscribe((data) => {
            this.userProfile = data;
        });
        this.authService.userRole.subscribe((data) => {
            this.currentUserRole = data;
            if (this.currentUserRole && this.currentUserRole.length > 0 && this.currentUserRole.indexOf(Roles.SystemAdmin) === -1) {
                if (this.permission && this.permission.length > 0) {
                    let hideElement = false;
                    let flag = false;
                    // for (let element of this.currentUserRole) {
                    //     if (this.permission.indexOf(element) === -1) {
                    //         // this.el.nativeElement.style.display = 'none';
                    //         hideElement = true;
                    //     }
                    //    else
                    if (this.appId) {
                        hideElement = false;
                        //if ((element == Roles.AppOwner || element == Roles.AppReader || element == Roles.AppNotificationOwner) && this.appId) {
                        this.authService.userProfile.subscribe((data) => {
                            this.userProfile = data;
                            if (this.userProfile.applicationRoles && this.userProfile.applicationRoles.length > 0) {
                                let associatedTenantId = null;
                                for (let obj of this.userProfile.applicationRoles) {
                                    let applicationFound = false;
                                    let tenantFound = false;
                                    for (let appObj of obj.associatedApplicationRoles) {
                                        for (let element of this.currentUserRole) {

                                            if (this.permission.indexOf(element) === -1) {
                                                // this.el.nativeElement.style.display = 'none';
                                                hideElement = true;
                                            } else {
                                                if (this.appId == appObj.application.id) {

                                                    if (element == Roles.TenantOwner || element == Roles.TenantReader) {
                                                        flag = true;
                                                        applicationFound = true;
                                                        hideElement = this.checkIfTheUserIsTenantOwner(appObj.application.associatedTenant.tenant.id, element)
                                                        if (!hideElement)
                                                            break;
                                                    }
                                                    else if (element == Roles.AppOwner || element == Roles.AppReader || element == Roles.AppNotificationOwner) {
                                                        applicationFound = true;
                                                        //if (element == Roles.AppOwner || element == Roles.AppReader || element == Roles.AppNotificationOwner) {
                                                        flag = true;
                                                        if (this.notificationId && appObj.applicationRoleType == ApplicationRoleType.applicationNotificationOwner) {
                                                            // this.el.nativeElement.style.display = 'none';
                                                            hideElement = false;
                                                        }
                                                        else if (this.notificationId && appObj.applicationRoleType == ApplicationRoleType.applicationReader)
                                                        {
                                                            hideElement = true;
                                                        }
                                                        else if (!this.notificationId && (appObj.applicationRoleType == ApplicationRoleType.applicationReader || appObj.applicationRoleType == ApplicationRoleType.applicationNotificationOwner))
                                                        {
                                                            hideElement = true;
                                                        }
                                                        else {
                                                            hideElement = false;
                                                        }
                                                        if (!hideElement)
                                                            break;
                                                    }
                                                }
                                                else{
                                                    if (element == Roles.TenantOwner || element == Roles.TenantReader){
                                                    hideElement = this.checkIfTheUserIsTenantOwner(this.tenantId, element)
                                                    if (!hideElement)
                                                        break;
                                                    }
                                                }
                                            }

                                        }

                                        if (applicationFound)
                                            break;
                                    }
                                    if (applicationFound)
                                        break;



                                }

                            }
                            else{
                            for (let element of this.currentUserRole) {

                                if (this.permission.indexOf(element) === -1) {
                                    hideElement=true;
                                }
                                else{
                                    hideElement=false;
                                    break;
                                }
                            }
                        }
                        });

                    }

                    // }
                    if(!this.disable){
                    if (hideElement)
                        this.el.nativeElement.style.display = 'none';
                    }
                    else{
                        if (hideElement)
                        this.el.nativeElement.disabled = true;
                    }
                }
            }

        });

    }

    checkIfTheUserIsTenantOwner(associatedTenantId, userRole) {
        let hideElement = false;
        let tenantFound = false;
        for (let tenantObj of this.userProfile.tenantRoles) {

            if (tenantObj.tenant.id == associatedTenantId) {
                tenantFound = true;
                if (userRole == Roles.TenantOwner && tenantObj.tenantRoleType == TenantRoleType.tenantOwner) {
                    hideElement = false;
                }
                else {
                    hideElement = true;
                }
                break;
            }
        }
        if (!tenantFound) {
            hideElement = true;
        }
        return hideElement;
    }
}