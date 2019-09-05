import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserDTO, Roles, ApplicationRoleType, TenantRoleType } from '../_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @Output() onModalClose = new EventEmitter();
  @Input() selectedUser:any;

  //remove this
  appList: any;
  roleList: any;
  tenantList: any[] = [];
  showTenantSpace: boolean = false;
  applicationList: any[] = [];
  showApplication: boolean = false;
  roleName:string="";
  fromUserPage: boolean = false;
  isLoaded: boolean = false;
  private params: any;
  roles=Roles;
  userId: string;
  appRoles:any[]=[ApplicationRoleType.applicationOwner,ApplicationRoleType.applicationReader,ApplicationRoleType.applicationNotificationOwner];
  tenantRoles:any[]=[TenantRoleType.tenantOwner,TenantRoleType.tenantReader];
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthenticationService, private userService: UserService) {
    //remove this
    this.appList = [{ id: 1, name: 'Pns' }, { id: 2, name: 'Collab' }, { id: 3, name: 'Parking' }, { id: 4, name: 'Towers' }];
    this.roleList = [{ roleID: 1, roleName: 'System Admin' }, { roleID: 2, roleName: 'Application owner' }, { roleID: 3, roleName: 'Application reader' }, { roleID: 2, roleName: 'Tenant space owner' }];

    this.roleName="Application owner";
    this.showTenantSpace=true;
    this.showApplication=true;
    this.tenantList = [{"id": 123, "name": "tenant space 1","application": [{"id":1,"name":"Aspire"}]},{"id": 124, "name": "tenant space 2","application": [{"id":2,"name":"Parking"},{"id":3,"name":"PNS"}]}];
  }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      
      this.fromUserPage = params['fromUserPage']; // (+) converts string 'id' to a number
      this.isLoaded = true;
      this.userId = params['userId'];
      // In a real app: dispatch action to load the details here.
   });
   if(this.fromUserPage && this.userId)
   {
     this.userService.getUserInfo("userProfile",this.userId,1).subscribe((res:any) => {
      this.selectedUser=res.data;
      this.selectedUser.userName=this.selectedUser.userName.replace(',','')
     });
    }
    else{
     this.authService.userProfile.subscribe((data) => {
      this.selectedUser=data;
      this.selectedUser.userName=this.selectedUser.userName.replace(',','')
   });
   }
  }

  onHide() {
    this.onModalClose.emit("view");
    // this.form.reset();
  }
  save() {
    //  if(this.form.invalid)
    //  return;
    // this.deviceService.saveToken(this.selectedDeviceRow.id,this.selectedDeviceRow).subscribe((data) => {
    // this.toastr.show("Notification token has been edited successfully");
    // this.onHide();
    // this.form.reset();
    // });
  }

  goToUserList()
  {
    this.router.navigate(["user"]);
  }

  filterTenantUserRoles(tenantList:any[],roleType: number)
  {
    return tenantList.filter(item=>item.tenantRoleType==roleType);
  }
  
  filterApplicationUserRoles(applicationRoleList:any[],roleType: number)
  {
    let applicationOwnerList=[]
    applicationRoleList.forEach(element => {
      let associatedApps = [];
      associatedApps=element.associatedApplicationRoles.filter(item=>item.applicationRoleType==roleType);
      if(associatedApps.length>0)
      applicationOwnerList.push({"tenant":element.tenant,"associatedApplicationRoles":associatedApps});
    });
    return applicationOwnerList;
  }
}
