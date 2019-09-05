import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TenantService } from 'src/app/Tenant/tenant.service';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';
import { ApplicationService } from 'src/app/Application/application.service';
import { UserService } from '../user.service';
import { Roles, SystemUser, TenantUser, AppUser, User, SystemRoleType, TenantRoleType, ApplicationRoleType } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, distinctUntilChanged, switchMap, map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { trigger } from '@angular/animations';
import { Subject, concat, of, Observable } from 'rxjs';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {
  @Output() onModalClose = new EventEmitter();
  @Input() selectedRole: number;
  title: string;
  roleLabelName: string;
  selectedUsers: any[] = [];
  userList: any=[];
  toggleDropdownOnSearch: boolean = false;
  tenantList:  Array<TenantListItem> = new Array<TenantListItem>();
  showTenantSpace: boolean = false;
  applicationList: any[]=[];
  showApplication: boolean = false;
  systemUsers: Array<SystemUser> = [];
  tenantUsers: Array<TenantUser> = [];
  appUsers: Array<AppUser> = [];
  selectedTenantId: any;
  selectedAppId: any;
  attr: string;
  roleID: number;
  searchText: string;
  form: FormGroup;
  userType: number;
  searchQueryStrings: string;
  usersinput$ = new Subject<string>();
  usersLoading = false;
  constructor(private userService: UserService, private tenantService: TenantService, private appService: ApplicationService, private toastr: ToastrService,private httpClient: HttpClient) {
    this.form = new FormGroup({
      email: new FormControl(null),
      application: new FormControl(null),
      tenantSpace: new FormControl(null)
    });
    // this.userList=[{ userId: "1230@gmail.com", userName: "1230 1230", imageUrl: "assets/images/Mask.png"},
    // {userId: "1240@gmail.com", userName: "1240 1240", imageUrl: "assets/images/Mask.png"},
    // {userId: "1250@gmail.com", userName: "1250 1250", imageUrl: "assets/images/Mask.png"}];

  }

  ngOnInit() {
    console.log(this.selectedRole);
    switch (this.selectedRole) {
      case 0: {
        this.title = "Add system admin";
        this.roleLabelName = "System admin name";
      }
        break;
      case 1: {
        this.title = "Add system reader";
        this.roleLabelName = "System reader name";
      }
        break;
      case 2: {
        this.title = "Add tenant owner";
        this.roleLabelName = "Tenant owner name";
        this.showTenantSpace=true;
        this.LoadTenantList();
      }
        break;
      case 3: {
        this.title = "Add tenant reader";
        this.roleLabelName = "Tenant reader name";
        this.showTenantSpace=true;
        this.LoadTenantList();
      }
        break;
      case 4: {
        this.title = "Add application owner";
        this.roleLabelName = "Application owner name";
        this.showTenantSpace=true;
        this.LoadTenantList();
        this.showApplication=true;
      }
        break;
      case 5: {
        this.title = "Add app notification owner";
        this.roleLabelName = "Application notification owner name";
        this.showTenantSpace=true;
        this.LoadTenantList();
        this.showApplication=true;
      }
        break;
        case 6: {
          this.title = "Add application reader";
          this.roleLabelName = "Application reader name";
          this.showTenantSpace=true;
          this.LoadTenantList();
          this.showApplication=true;
        }
          break;
         
      default:

    }

    //user search 
    //this.onSearch(this.form.controls.email.value,null);
   

  //    this.form.controls.email.valueChanges.pipe(
  //     this.setQueryStrings(),
  //     debounceTime(500),
  //     filter(value => value.length >= 3),
  //     distinctUntilChanged(),
  //     switchMap(searchTerm => this.userService.searchUsers(searchTerm,this.selectedTenantId,this.selectedAppId,userType)),
  //   ).subscribe((response:any) => {
  //     this.userList = response.data;  
  // });
  this.loadusers();
  }

  private loadusers() {
    // this.userList = concat(
    //     of([]), // default items
    //     this.usersinput$.pipe(
    //        debounceTime(200),
    //        distinctUntilChanged(),
    //        tap(() => this.setQueryStrings(),()=>this.usersLoading = true),
    //        switchMap(term => this.userService.searchUsers(term,this.selectedTenantId,this.selectedAppId,this.userType).pipe(
    //            catchError(() => of([])), // empty list on error
    //            tap(() => this.usersLoading = false)
    //        ))
    //     )
    // );

        this.usersinput$.pipe(
      tap(() =>this.setQueryStrings(),()=>this.usersLoading = true),
      debounceTime(500),
      filter(value => value.length >= 3),
      distinctUntilChanged(),
      switchMap(searchTerm => this.userService.searchUsers(searchTerm,this.selectedTenantId,this.selectedAppId,this.userType)),
    ).subscribe((response:any) => {
      this.userList = response.data;  
      tap(()=>this.usersLoading = true)
  });
}

  setQueryStrings()
  {
    if(this.selectedRole==0 || this.selectedRole==1)
    this.userType=0;
    else if(this.selectedRole==2 || this.selectedRole==3)
    this.userType=1;
    else if(this.selectedRole==4 || this.selectedRole==5 || this.selectedRole==6)
    this.userType=2;

    if(this.userType==0)
    this.searchQueryStrings=`&usertype=${this.userType}`;
    else if(this.userType==1)
    this.searchQueryStrings=`&tenantid=${this.selectedTenantId}&usertype=${this.userType}`;
    else if(this.userType==2)
    this.searchQueryStrings=`&appentryid=${this.selectedAppId}&usertype=${this.userType}`;

  }
  initalize()
  {
    
  }

  LoadTenantList() {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
      this.tenantList = res.data.items;
      this.selectedTenantId="all";
      this.selectedAppId="all";
    });
  }

  onSelectTenant(value: any) {
    this.selectedTenantId=value;
    if(this.selectedRole==4 || this.selectedRole==5 || this.selectedRole==6)
    this.LoadApplicationList(value);
    else{
    if(this.searchText)
    {
      this.selectedUsers=[];
      this.userList = [];
      this.toggleDropdownOnSearch=false;
      //this.onSearch(this.searchText,null);
    }
  }
  }

  onSelectApplication(value: any) {
    this.selectedAppId=value;
    if(this.searchText)
    {
      this.selectedUsers=[];
      this.userList = [];
      this.toggleDropdownOnSearch=false;
      //this.onSearch(this.searchText,null);
    }
  }
  
  LoadApplicationList(tenantId) {
    this.appService.getApplicationListByPageSize(tenantId,null).subscribe((appList: any) => {
      this.applicationList = appList.data.items;
      this.selectedAppId="all";
    });
  }

  onHide() {
    this.onModalClose.emit("modal");
    // this.form.reset();
  }

  closeDropdown()
  {
    this.toggleDropdownOnSearch = false;
  }

  public onSearch(value: any, select: NgSelectComponent) {
    // if(value.term.length>=3)
    // { 
    //   this.searchText=value;
    //   if(this.selectedRole==0 || this.selectedRole==1)
    //   this.userService.searchUsers(value.term,"","",0).subscribe((result: any) => {
    //     this.userList = result.data;
    //     this.toggleDropdownOnSearch = true;
    //   });
    //   else if(this.selectedRole==2 || this.selectedRole==3)
    //   this.userService.searchUsers(value.term,this.selectedTenantId,null,1).subscribe((result: any) => {
    //     this.userList = result.data;
    //     this.toggleDropdownOnSearch = true;
    //   });
    //   else if(this.selectedRole==4 || this.selectedRole==5 || this.selectedRole==6)
    //   this.userService.searchUsers(value.term,null,this.selectedAppId,2).subscribe((result: any) => {
    //     this.userList = result.data;
    //     this.toggleDropdownOnSearch = true;

    //   });
    // }

     //user search 
    
    //  let userType;
    //  if(this.selectedRole==0 || this.selectedRole==1)
    //  userType=0;
    //  else if(this.selectedRole==1 || this.selectedRole==2)
    //  userType=1;
    //  else if(this.selectedRole==3 || this.selectedRole==4 || this.selectedRole==5)
    //  userType=2;
 
    //  let searchQueryStrings="";
    //  if(userType==0)
    //  searchQueryStrings=`&usertype=${userType}`;
    //  else if(userType==1)
    //  searchQueryStrings=`&tenantid=${this.selectedTenantId}&usertype=${userType}`;
    //  else if(userType==2)
    //  searchQueryStrings=`&appentryid=${this.selectedAppId}&usertype=${userType}`;
 
    //   this.form.controls.email.valueChanges.pipe(
    //    debounceTime(500),
    //    filter(value => value.length >= 3),
    //    distinctUntilChanged(),
    //    switchMap(searchTerm => this.httpClient.get<any>(`${this.userService.restServiceURI}?q=${searchTerm}${searchQueryStrings}`)),
    //    map(response => this.userList = response.data)
    //  );
  }

  public onClear(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = false;
  }

  public onItemAdd(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = true;
    if(value.roleType!=-1)
    {
    const index: number = this.selectedUsers.indexOf(value.id);
    if (index !== -1) {
        this.selectedUsers.splice(index, 1);
    }  
  }
  
  }

  //create admin/reader
  create()
  {
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

    if(this.selectedRole == Roles.SystemAdmin || this.selectedRole==Roles.SystemReader){
    console.log("test"+this.selectedUsers);

    // this.selectedUsers.forEach(element => {
    //   this.systemUsers.push({'userId':element.userId, 'userName': element.userName, 'imageUrl': element.imageUrl});
    // });

    this.userService.createSysUsers(this.selectedUsers,this.attr,this.roleID).subscribe((data) => {
      this.onHide();
      this.toastr.show("Successful");
      this.form.reset();
      });
    }
    else if(this.selectedRole == Roles.TenantOwner || this.selectedRole==Roles.TenantReader){
      console.log("test"+this.selectedUsers);
  
      // this.selectedUsers.forEach(element => {
      //   this.tenantUsers.push({'userId':element.userId, 'userName': element.userName, 'imageUrl': element.imageUrl});
      // });
  
      this.userService.createTenantUsers(this.selectedUsers,this.attr,this.selectedTenantId,this.roleID).subscribe((data) => {
        this.onHide();
        this.toastr.show("Successful");
        this.form.reset();
        });
      }
      else if(this.selectedRole == Roles.AppNotificationOwner || this.selectedRole==Roles.AppOwner || this.selectedRole==Roles.AppReader){
        console.log("test"+this.selectedUsers);
    
        this.selectedUsers.forEach(element => {
          this.appUsers.push({'userId':element.userId, 'userName': element.userName, 'imageUrl': element.imageUrl, 'tenantId': this.selectedTenantId, 'appId': this.selectedAppId, 'roleType':this.roleID});
        });
    
        this.userService.createAppUsers(this.appUsers,this.attr,this.selectedTenantId,this.selectedAppId).subscribe((data) => {
          this.onHide();
          this.toastr.show("Successful");
          this.form.reset();
          });
        }
  }
  disableItem(event:any,item:any)
  {
    if((item.roleType && item.roleType!=-1))
    event.stopPropagation();
    // if((item.systemRoleType && item.systemRoleType!=-1)||(item.tenantRoleType && item.tenantRoleType!=-1)||(item.applicationRoleType && item.applicationRoleType!=-1))
    // event.stopPropagation();
    // else if((this.selectedRole==2 || this.selectedRole==3) && item.tenantRoleType!=-1)
    // event.stopPropagation();
    // else if((this.selectedRole==4 || this.selectedRole==5 || this.selectedRole==6) && item.applicationRoleType!=-1)
    // event.stopPropagation();
  }
  
}
