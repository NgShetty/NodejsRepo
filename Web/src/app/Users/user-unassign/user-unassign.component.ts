import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { Roles, UserListItem, SystemRoleType, TenantRoleType, ApplicationRoleType } from '../_models/user';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-unassign',
  templateUrl: './user-unassign.component.html',
  styleUrls: ['./user-unassign.component.css']
})
export class UserUnassignComponent implements OnInit {

  @Input() user:  any;
  @Input() selectedRole : any;
  @Input() appOrTenantId: any;
  @Output() onModalClose = new EventEmitter();
  @Input() assignedEntityName: string;
  roleName: string;
  attr: string;
  roleID: number;

  constructor(private apiService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
  
    if(this.selectedRole==Roles.SystemAdmin)
    this.roleName="System Admin";
    else if(this.selectedRole==Roles.SystemReader)  
    this.roleName="System Reader";
    else if(this.selectedRole==Roles.TenantOwner)
    this.roleName="Tenant Owner";
    else if(this.selectedRole==Roles.TenantReader)  
    this.roleName="Tenant Reader";
    if(this.selectedRole==Roles.AppNotificationOwner)  
    this.roleName="Application Notification Owner";
    if(this.selectedRole==Roles.AppOwner)  
    this.roleName="Application Owner";
    if(this.selectedRole==Roles.AppReader)  
    this.roleName="Application Reader";

  //   // this.roleName=this.user.role.find(x=>x.roleID=this.selectedRole).roleName;
  //  if(this.selectedRole==Roles.TenantReader || this.selectedRole==Roles.TenantOwner)
  //  {
  //    this.assignedEntityName = this.user.tenantApplicationList.find(x=>x.applicationId=this.appOrTenantId).applicationName;
  //  }
  //  else if(this.selectedRole==Roles.AppNotificationOwner || this.selectedRole==Roles.AppOwner || this.selectedRole==Roles.AppReader)
  //  {
  //    //check after integrating to API
  //    this.assignedEntityName = this.user.applicationList.find(x=>x.applicationId=this.appOrTenantId).applicationName;
  //  }
  }

  onHide() {
    this.onModalClose.emit("unassign");
  }

  ConfirmUnassign(user: any) {
    if(this.selectedRole==Roles.SystemAdmin)
    {
    this.attr="systemUser";
    this.roleID= SystemRoleType.systemAdmin;
    }
    else if(this.selectedRole==Roles.SystemReader)
    {  
      this.attr="systemUser";
      this.roleID= SystemRoleType.systemReader;
    }
    else if(this.selectedRole==Roles.TenantOwner)
    {
      this.attr="tenantUser";
      this.roleID= TenantRoleType.tenantOwner;
    }
    else if(this.selectedRole==Roles.TenantReader)
    {  
      this.attr="tenantUser";
      this.roleID= TenantRoleType.tenantReader;
    }
    if(this.selectedRole==Roles.AppNotificationOwner)
    {  
      this.attr="applicationUser";
      this.roleID= ApplicationRoleType.applicationNotificationOwner;
    }
    if(this.selectedRole==Roles.AppOwner)
    {  
      this.attr="applicationUser";
      this.roleID= ApplicationRoleType.applicationOwner;
    }
    if(this.selectedRole==Roles.AppReader)
    {  
      this.attr="applicationUser";
      this.roleID= ApplicationRoleType.applicationReader;
    }
    this.apiService.unassignUser(user.id,this.attr,this.appOrTenantId,this.roleID).subscribe((data) => {
      this.toastr.show("The user has successfully removed from the role");
      this.onHide();
    });
  }

}
