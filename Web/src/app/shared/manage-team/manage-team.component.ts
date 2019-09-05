import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from 'src/app/Users/user.service';
import { User } from 'src/app/Users/_models/user';
import { ApplicationListItem } from 'src/app/Application/_models/applicationList';
import { ApplicationService } from 'src/app/Application/application.service';
import { ToastrService } from 'ngx-toastr';
import { EditApplicationDTO, ApplicationDetails } from 'src/app/Application/_models/editApplication';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css']
})
export class ManageTeamComponent implements OnInit {
  ifApplication: boolean = true;
  @Input() isApplication: boolean;
  // @Input() selectedTenantId: any;
  @Input() selectedApp: ApplicationDetails;
  // @Input() tenantUserList=[];
  @Output() onModalClose = new EventEmitter();
  userList: any[] = [];
  applicationUsers: any[] = [];
  constructor(private userService: UserService, private appService: ApplicationService, private toastr: ToastrService) {
    // this.tenantUserList=[];
  }

  ngOnInit() {
    //  this.tenantUserList=[];
    if (this.selectedApp.teamMembers) {
      // this.selectedApp.teamMembers.forEach(element => {
        this.userList=this.selectedApp.teamMembers
      // });
      this.applicationUsers = this.userList;
    }
    if (this.isApplication) {

    }
    // else{
    //   if(!this.selectedTenantId)
    //   this.selectedTenantId=null;
    // }
  }
  onHide() {
    this.onModalClose.emit("manage");
  }
  addApplicationUsers(user: any) {
    if (this.applicationUsers && this.applicationUsers.length >= 0 && this.applicationUsers.filter(
      x => x.userId == user.userId).length <= 0)
      this.applicationUsers.push({ 'userId': user.userId, 'userName': user.userName, 'imageUrl': user.imageUrl, 'tenantId': this.selectedApp.tenant.id, 'appId': this.selectedApp.id, 'roleType': user.roleType });
    else if (!this.applicationUsers) {
      this.applicationUsers = [];
      this.applicationUsers.push({ 'userId': user.userId, 'userName': user.userName, 'imageUrl': user.imageUrl, 'tenantId': this.selectedApp.tenant.id, 'appId': this.selectedApp.id, 'roleType': user.roleType });
    }
    else {
      this.applicationUsers = this.applicationUsers.filter(x => x.userId != user.userId);
      this.applicationUsers.push({ 'userId': user.userId, 'userName': user.userName, 'imageUrl': user.imageUrl, 'tenantId': this.selectedApp.tenant.id, 'appId': this.selectedApp.id, 'roleType': user.roleType });
    }
  }
  public onSearchChange(searchvalue: any) {
    if (searchvalue.length >= 3) {
      //   if(!this.isApplication)
      //   {
      //     this.userService.searchUsers(searchvalue,this.selectedTenantId,null,1).subscribe((result: any) => {
      //       this.userList=[];
      //       this.userList = result.data;
      //   });
      //   }
      //  else
      this.userService.searchUsers(searchvalue, this.selectedApp.tenant.id, this.selectedApp.id, 2).subscribe((result: any) => {
        this.userList = [];
        this.userList = result.data;
      });
    }
    // else
    // {
    //   this.userList=this.selectedApp.teamMembers;
    //   this.applicationUsers=this.selectedApp.teamMembers;
    // }
  }

  createAppUsers() {
    // // this.selectedApp.t
    // this.selectedUsers.forEach(element => {
    //   this.appUsers.push({'userId':element.userId, 'userName': element.userName, 'imageUrl': element.imageUrl, 'tenantId': this.selectedTenantId, 'appId': this.selectedAppId, 'applicationRoleType':this.roleID});
    // });

    this.userService.createAppUsers(this.applicationUsers, "applicationUser",this.selectedApp.tenant.id,this.selectedApp.id).subscribe((data) => {
      this.onHide();
      this.toastr.show("Successful");
     });

  }
  unassignTheUser(user: any) {
    if (user.roleType!=-1) {
      this.userService.unassignUser(user.id, "applicationUser", this.selectedApp.id, user.roleType).subscribe((data) => {
        this.toastr.show("The user has successfully removed from the role");
        this.userList = this.userList.filter(item => item.userId != user.userId);
        this.applicationUsers = this.applicationUsers.filter(item => item.userId != user.userId);
      });
    }
    else {
      this.applicationUsers = this.applicationUsers.filter(item => item.userId != user.userId);
      this.userList = this.userList.filter(item => item.userId != user.userId);
    }
  }

}
