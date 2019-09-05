import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { UserDTO, Roles, UserListItem, SystemRoleType, TenantRoleType, ApplicationRoleType, AdminUser } from '../_models/user';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from '@ng-select/ng-select';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';
import { TenantService } from 'src/app/Tenant/tenant.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  totalCount: number = 0;
  itemsCount: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  showserarchImage: boolean = false;
  searchUserEmailText: number = 0;
  public query: NgModel;
  sortByUserEmail: boolean = false;
  hideSortByUserEmail: boolean = true;
  userEmailDsc: boolean = true;
  userList: Array<UserListItem> = new Array<UserListItem>();
  userListTemp: Array<UserListItem> = new Array<UserListItem>();
  selectedUserDTO: UserListItem = new UserListItem();
  sortByDate: boolean = false;
  createdDateDsc: boolean = false;
  showModal: boolean = false;
  showUserLabel: boolean = true;
  clsRoleTabClick : string="";

  //remove this
  appList: any;
  roleList: any;
  clsSysAdminRoleTabClick: string;
  clsTenReaderRoleTabClick: string;
  clsTenOwnerRoleTabClick: string;
  clsSysReaderRoleTabClick: string;
  clsAppOwnerRoleTabClick: string;
  clsAppNotificationOwnerRoleTabClick: string;
  clsAppReaderRoleTabClick: string;
  roleName:string="system admin";
  selectedRole: number=0;
  @ViewChild('userTable') table: any;
  expandedRow : any;
  rows: any[] = [];
  expanded: any = {};
  showUnassignModal: boolean=false;
  selectedUser: any = {};
  selectedUserSearch: any = {};
  toggleDropdownOnSearch: boolean = false;
  appOrTenantId: any;
  nameWidth: any;
  emailWidth: any;
  tenantSpaceWidth: any;
  appNameWidth: any;
  statusWidth: any;
  unassignWidth: any;
  attr: string;
  assignedEntityName: string;
  roleID: number;
  roles=Roles;
  filteredUserList: AdminUser[]=[];
  userId: string="";
  selectedTenantId: string="";
  tenantList:TenantListItem[]=[];
  pageSizeSelected:number=10;
  constructor(private router: Router, private userService: UserService, private toastr: ToastrService,private loader: LoaderService, private authService: AuthenticationService, private tenantService: TenantService) {
   
    this.authService.userProfile.subscribe((data) => {
      if(data)
      this.userId=data.userId;
   });

    //remove this
    this.appList = [{ id: 1, name: 'Pns' }, { id: 2, name: 'Collab' }, { id: 3, name: 'Parking' }, { id: 4, name: 'Towers' }];
    this.roleList = [{ roleID: 1, roleName: 'System Admin' }, { roleID: 2, roleName: 'Application owner' }, { roleID: 3, roleName: 'Application reader' }, { roleID: 2, roleName: 'Tenant space owner' }];

    // this.userList = [{ userName: 'Minoosha Chinni', email: 'mchinni@deloitte.com', role: [{ roleID: 0, roleName: 'System Admin' }, { roleID: 4, roleName: 'Application owner' }, { roleID: 2, roleName: 'Tenant space owner' }], applicationList: [{ id: 1, name: 'Pns' }], tenantList: [{id:'1235', name: 'tenant3',applicationList:[{ id: 1, name: 'PNS' }]}],status: true },
    // { name: 'Sneha Gera',email: 'sneha.gera@deloitte.com', role: [{ roleID: 0, roleName: 'System Admin' }, { roleID: 4, roleName: 'Application owner' }, { roleID: 6, roleName: 'Application reader' }], applicationList: [{ id: 3, name: 'Parking' },{ id: 2, name: 'Collab' }], tenantList: [{id:'1235', name: 'tenant3',applicationList:[{ id: 3, name: 'Parking' }, { id: 2, name: 'Collab' }]}],status: true },
    // { name: 'Muneer Pinjar',email: 'muneer.pinjar@deloitte.com', role: [{ roleID: 1, roleName: 'System Admin' }, { roleID: 2, roleName: 'Application owner' }], applicationList: [{ id: 1, name: 'Pns' }], tenantList: [{id:'1234', name: 'tenant2',applicationList:[{ id: 3, name: 'Parking' }, { id: 2, name: 'Collab' }]}], status: true },
    // { name: 'Chandra',email: 'chandra@deloitte.com', role: [{ roleID: 0, roleName: 'System Admin' }, { roleID: 4, roleName: 'Application owner' }], applicationList: [{ id: 7, name: 'Uber' }, { id: 9, name: 'ClientService' }, { id: 13, name: 'TDS' }], tenantList: [{id:'123', name: 'tenant1',applicationList:[{ id: 7, name: 'Uber' }, { id: 9, name: 'ClientService' }]},{id:'1234', name: 'tenant2',applicationList:[ { id: 13, name: 'TDS' }]}],status: true },
    // { name: 'xyz Two',email: 'zyx@deloitte.com', role: [{ roleID: 6, roleName: 'Application reader' }, { roleID: 2, roleName: 'Tenant space owner' }], applicationList: [], tenantList: [],status: true },
    // { name: 'abc One',email: 'abc@deloitte.com', role: [{ roleID: 6, roleName: 'Application reader' }, { roleID: 2, roleName: 'Tenant space owner' }], applicationList: [{ id: 1, name: 'Pns' }, { id: 2, name: 'Collab' }, { id: 3, name: 'Parking' }], tenantList: [{id:'123', name: 'tenant1',applicationList:[{ id: 4, name: 'Aspire' }, { id: 5, name: 'Ola' }]},{id:'1234', name: 'tenant2',applicationList:[{ id: 3, name: 'Parking' }, { id: 2, name: 'Collab' }]}],status: false },
    // { name: 'def One',email: 'def@deloitte.com', role: [{ roleID: 6, roleName: 'Application reader' }, { roleID: 2, roleName: 'Tenant space owner' }], applicationList: [{ id: 1, name: 'Pns' }, { id: 2, name: 'Collab' }, { id: 3, name: 'Parking' }], tenantList: [{id:'123', name: 'tenant1',applicationList:[{ id: 4, name: 'Aspire' }, { id: 5, name: 'Ola' }]},{id:'1234', name: 'tenant2',applicationList:[{ id: 3, name: 'Parking' }, { id: 2, name: 'Collab' }]}],status: true }];

    this.userListTemp = this.userList;
    this.totalCount = 6;
    this.itemsCount = 6;
    this.pageSize = 10;
    this.pageNumber = 1
    this.startPageNumber = 1;
    this.endPageNumber = 1;

    this.loadTenants();
  }

  loadTenants()
  {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
      this.tenantList=res.data.items;
      this.selectedTenantId="0";
    });
  }

  ngOnInit() {
    this.LoadUsers(this.selectedTenantId);
  }

  LoadUsers(tenantId:any) {
    this.loader.show();
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
    if(tenantId=="0")
    tenantId=null;
    this.userList=null;
    this.userListTemp=null;
    this.pageSize = 10;
    this.pageNumber = 1
    this.userService.getAllusersList(this.selectedTenantId,this.pageSize, this.attr,this.roleID,this.pageNumber,this.fieldName,this.sortOrder).subscribe((res: any) => {
      this.loader.hide();
      this.userList = res.data.items;
      this.userListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;     
      this.startPageNumber = this.pageNumber;
      this.endPageNumber = this.pageSize;
      if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;


      // //grid footer fixed height
      // let tblBody = this.table;

      // if (tblBody.bodyComponent && tblBody.bodyComponent._bodyHeight) {
      //   let height = (66 * this.pageSize);
      //   tblBody.bodyComponent._bodyHeight = height.toString() + "px";
      // }
    });
  }

  close($event) {
    //remove overflow hidden for body on modal close
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("overflowFixed");   //remove the class

    if ($event == "modal") {
      this.showModal = !$event;
    }
    else if ($event == "unassign") {
      this.showUnassignModal = !$event;
    }

    this.LoadUsers(this.selectedTenantId);
  }

  openUnassignModal(selectedUserRow: any, appOrTenantId: any, assignedEntity: string) {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    this.selectedUser=selectedUserRow;
    this.appOrTenantId = appOrTenantId;
    this.assignedEntityName = assignedEntity;
    this.showUnassignModal = true;
  }

  openModal() {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class
     
    this.showModal = true;
  }

  focus(fieldName: any) {
    this.showserarchImage = true;
    this.hideSortByUserEmail = false;
  }

  focusout(fieldName: any) {
    this.showserarchImage = false;
    this.hideSortByUserEmail = true;
  }

  updateFilter(event, fieldName: any) {
    //alert('filter');

    const val = event.target.value;

    // filter our data
    if (fieldName == "UserName") {
      const temp = this.userListTemp.filter(function (d) {
        return d.userName.indexOf(val) !== -1 || !val;
      });
      // update the rows
      this.userList = temp;
    }

    // Whenever the filter changes, always go back to the first page
  }
fieldName:string="UserEmail";
sortOrder:any=false;
  gridSort(fieldName: any, sortDirection: any) {
    if (fieldName == "UserEmail") {
      this.sortByUserEmail = true;
      this.createdDateDsc = false;
      this.userEmailDsc = (this.userEmailDsc == true ? false : true);
    }
    this.fieldName=fieldName;
    this.sortOrder=sortDirection;
   
    this.userService.getAllusersList(this.selectedTenantId,this.pageSize, this.attr,this.roleID,this.pageNumber,this.fieldName,this.sortOrder).subscribe((res: any) => {
      this.userList = res.data.items;
    });
  }

  textboxpagechange(pageNumber: any) {
    this.onFooterPage(pageNumber);
  }

  onFooterPage(value: any) {

    let currentPageNumber = 1;
    if (value != "" && value.page == undefined)
      currentPageNumber = value;
    else if (value != "")
      currentPageNumber = value.page;
    this.pageNumber=currentPageNumber;

      this.userService.getAllusersList(this.selectedTenantId,this.pageSize, this.attr,this.roleID,this.pageNumber,this.fieldName,this.sortOrder).subscribe((res: any) => {
        if(res.data.items!=null){

      this.userList = res.data.items;
      this.userListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;

     

      if (this.pageNumber != 1) {
        this.startPageNumber = ((this.pageNumber - 1) * this.pageSize) + 1;
        this.endPageNumber = ((this.pageNumber - 1) * this.pageSize) + this.pageSize;
        if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;

      }
      else {
        this.startPageNumber = this.pageNumber;
        this.endPageNumber = this.pageSize;
        if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;
      }
    }
    });
  
  }

  onFooterPageSizeChange(pageSize: any) {
    this.pageSizeSelected=pageSize;
    //grid footer fixed height
    // let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

    // if (tblBody.length != 0) {
    //   let height = (66 * pageSize);
    //   tblBody[0].style.height = height.toString() + "px";
    // }

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
   this.pageSize=pageSize;
   this.pageNumber=1;
    this.userService.getAllusersList(this.selectedTenantId,this.pageSize, this.attr,this.roleID,this.pageNumber,this.fieldName,this.sortOrder).subscribe((res: any) => {

      this.userList = res.data.items;
      this.userListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;

      this.pageSize = pageSize;
      this.pageNumber = 1;

      if (this.pageNumber != 1) {
        this.startPageNumber = ((this.pageNumber - 1) * this.pageSize) + 1;
        this.endPageNumber = ((this.pageNumber - 1) * this.pageSize) + this.pageSize;
        if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;

      }
      else {
        this.startPageNumber = this.pageNumber;
        this.endPageNumber = this.pageSize;
        if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;

      }
    });
  }

  tabClick(role : string)
  {
    let roleDiv = document.getElementById('roles');
    console.log(roleDiv);
    
    Object.keys(roleDiv.childNodes).forEach(element => {
      console.log(element);
     if(roleDiv.childNodes[element].getAttribute("name")==role)
     {
      roleDiv.childNodes[element].classList.remove("lable-edit-tenat-head-inactive");
      roleDiv.childNodes[element].classList.add("lable-edit-tenat-head-active");
      this.roleName=roleDiv.childNodes[element].innerHTML;
     }
     else
     {
      roleDiv.childNodes[element].classList.remove("lable-edit-tenat-head-active");
      roleDiv.childNodes[element].classList.add("lable-edit-tenat-head-inactive");
     }
    });

    if(role=="sysAdmin"){
     this.selectedRole=Roles.SystemAdmin;
     this.roleName="system admin";
    }
    else if(role=="sysReader"){
    this.selectedRole=Roles.SystemReader;
    this.roleName="system reader";
    }
     else if(role=="tenOwner"){
     this.selectedRole=Roles.TenantOwner;
     this.roleName="tenant owner";
     }
     else if(role=="tenReader"){
     this.selectedRole=Roles.TenantReader;
     this.roleName="tenant reader";
     }
     else if(role=="appOwner"){
     this.selectedRole=Roles.AppOwner;
     this.roleName="app owner";
     }
     else if(role=="appNotificationOwner"){     
     this.selectedRole=Roles.AppNotificationOwner;
     this.roleName="app notification owner";
     }
     else if(role=="appReader"){
     this.selectedRole=Roles.AppReader;
     this.roleName="app reader";
     }
     if(this.pageSizeSelected==10)
     this.LoadUsers(this.selectedTenantId);
     else
     this.onFooterPageSizeChange(this.pageSizeSelected);
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.expandedRow=row;
    this.nameWidth = this.table._internalColumns[0].width;
    this.emailWidth = this.table._internalColumns[1].width;
    this.unassignWidth = this.table._internalColumns[this.table._internalColumns.length-1].width;
    this.statusWidth = this.table._internalColumns[this.table._internalColumns.length-2].width;
    if(!(this.selectedRole==Roles.SystemAdmin || this.selectedRole==Roles.SystemReader))
    this.tenantSpaceWidth =  this.table._internalColumns[2].width;
    if(this.selectedRole==Roles.AppReader || this.selectedRole==Roles.AppOwner || this.selectedRole==Roles.AppNotificationOwner)
    this.appNameWidth =  this.table._internalColumns[3].width;

    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  openModalToViewUserDetails(event: any) {
    this.router.navigate(["user/edit"]);
  }

  public onSearch(value: any, select: NgSelectComponent) {
    if(value.term.length>=3){
    this.userService.searchUsersFromDb(value.term).subscribe((res: any) => {
      this.filteredUserList=res.data;
    this.toggleDropdownOnSearch = true;
    });
    }
  }

  public onClear(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = false;
  }

  public onItemAdd(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = true;
    this.selectedUser=value;
    this.router.navigate(["user/edit",{ fromUserPage: true,userId: this.selectedUser.userId}]);

  }

  unassign(id:any)
  {
  }

  filterItemsOfType(selectedRole: number, row){
    let expandedList : any = [];
    if(row && (selectedRole==4 || selectedRole==5 || selectedRole==6))
    {
      // expandedList=this.expandedRow.tenantApplicationList;
      row.tenantApplicationList.forEach(element => {
        expandedList.push({'tenantName':element.tenantObj.tenantName,'tenantId':element.tenantObj.tenantId, 'applicationList':element.applicationObjs});
      });
    }
    else if(row && !(selectedRole==4 || selectedRole==5 || selectedRole==6))
    {
      row.tenantSpaceNames.forEach(element => {
        expandedList.push({'tenantName':element.tenantName, 'tenantId':element.tenantId});
      });
    }
    return expandedList;
  }
  onChange(args: any) {
    this.selectedTenantId=args.target.value;
      this.LoadUsers(args.target.value);
  }
}
