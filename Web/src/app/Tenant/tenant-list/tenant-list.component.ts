import { Component, OnInit } from '@angular/core';
import { AddTenant } from '../_models/addTenant';
import { TenantListItem } from '../_models/tenantList';
import { Page } from 'src/app/shared/resource/Page';
import { TenantService } from '../tenant.service';
import { Observable } from 'rxjs/internal/Observable';
import { AppPoolListItem } from 'src/app/AppPool/_models/app-pool-details';
import { TenantAllocated } from '../_models/tenant-details';
import { EditTenant } from '../_models/editTenant';
import { NgModel } from '@angular/forms';
import { AppPoolServiceService } from 'src/app/AppPool/app-pool-service.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { UserService } from 'src/app/Users/user.service';
import { AdminUser, TenantRoleType, Roles } from 'src/app/Users/_models/user';


@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ["./tenant-list.component.css",
    "../../../../node_modules/@swimlane/ngx-datatable/release/index.css",
    "../../../../node_modules/@swimlane/ngx-datatable/release/themes/material.css",
    "../../../../node_modules/@swimlane/ngx-datatable/release/assets/icons.css"
  ]
})
export class TenantListComponent implements OnInit {

  page = new Page();
  addTenant: AddTenant = new AddTenant();
  tenantsList: TenantAllocated = new TenantAllocated();

  tenantListView: Array<TenantListItem> = new Array<TenantListItem>();
  tenantListViewTemp: any;

  editTenantRecord: EditTenant = new EditTenant();

  modaEditTenantSpaceTeam: boolean = false;
  modalCreateTenant: boolean = false;
  searchTenantNameText: number = 0;
  showserarchImage: boolean = false;
  modalDeleteTenant: boolean = false;

  appPoolObservable: Observable<Array<AppPoolListItem>[]>;

  AssingedAppPools: string = "Assinged pools: <br> App Pool 1 <br> App Pool 2"

  TenantSpaceNameDelete: string;
  diableConti: string = "disabled";
  tenantIdDelete: any;
  totalCount: number = 0;
  itemsCount: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  public query: NgModel;
  createTenant: boolean = true;
  manageTenant: boolean = false;

  tenantNameDsc: boolean = false;
  createdDateDsc: boolean = false;
  sortByTenantName: boolean = false;
  sortByDate: boolean = false;
  hideSortByTenantName: boolean = true;
  resTenanatById: any;
  appPoolsList: any;
  allocatedSpaceCount: number = 0;
  improperAllocation: number = 0;
  onLoadOfEditTenant: boolean = false;
  clsTabActiveAllocate: string = "";
  clsTabActiveManage: string = "";
  clsManageTeamModal:string="";
  clsAllocateModal:string="";
  owners: any[] = [];
  readers: any[] = [];
  tenantUserList:AdminUser[]=[];
  userList:any[]=[];
  isEdit: boolean=false;
  roles=Roles;
  keyword:string="";
  constructor(private apiService: TenantService, private appPoolService: AppPoolServiceService, private toastrService: ToastrService, private loader: LoaderService, private userService: UserService) {
    this.LoadTenantList();
    this.clsTabActiveAllocate="nav-link active lable-edit-tenat-head-active";
    this.clsTabActiveManage="nav-link active lable-edit-tenat-head-inactive";

    //remove later
    this.owners = [{userName: "ten ten", imageUrl: "assets/images/Mask.png"},
    {userName: "eleven eleven", imageUrl: "assets/images/Mask.png"},
    {userName: "twelve twelve", imageUrl: "assets/images/Mask.png"}];
    this.readers = [{userName: "one one", imageUrl: "assets/images/Mask.png"},
    {userName: "two two", imageUrl: "assets/images/Mask.png"},
    {userName: "three three", imageUrl: "assets/images/Mask.png"}];
  }

  ngOnInit() {

  }
  LoadTenantList() {
    this.loader.show();
    this.isEdit=false;
    this.tenantListView=null;
    this.tenantListViewTemp=null;
    this.apiService.getTenantList().subscribe((res: any) => {
      this.loader.hide();
      this.tenantListView = res.data.items;
      this.tenantListViewTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;
      this.pageSize = 10;
      this.pageNumber = 1
      this.startPageNumber = this.pageNumber;
      this.endPageNumber = this.pageSize;
      if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;

      //grid footer fixed height
      let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

      // if (tblBody.length != 0) {
      //   let height = (66 * this.pageSize);
      //   tblBody[0].style.height = height.toString() + "px";
      // }

      //remove resizing columns
    let tblHeader = document.getElementsByClassName('resizeable') as HTMLCollectionOf<HTMLElement>;
    if (tblHeader.length != 0) {
      for(var i =0; i < tblHeader.length; i++)
      {
        tblHeader[i].classList.remove('resizeable');
      }
    }
    
    });
  }

  createTenantAlert() {
    this.tenantUserList=[];
    this.userList=[];
    this.addTenant.name = "";
    this.LoadAppPoolList();
    this.addOverFlowHiddenToBodyCss();
    this.modalCreateTenant = true;
    this.createTenant = true;
    this.manageTenant = false;
    this.diableConti = "disabled";
  }

  validateTenant(actionType?: string) {
    var tenantSpaceName = "";
    this.allocatedSpaceCount = 0;
    if (actionType == 'edit') {
      tenantSpaceName = this.editTenantRecord.name.trim();
      this.editTenantRecord.appPoolsAllocated.forEach(element => {
        if (element.currentTenantQuota > 0)
          this.allocatedSpaceCount++;
          if (element.available - element.currentTenantQuota < 0)
            this.improperAllocation++;
      });
    }
    else    
    {
     tenantSpaceName = this.addTenant.name.trim();
     this.addTenant.appPoolsAllocated.forEach(element => {
      if (element.currentTenantQuota > 0)
        this.allocatedSpaceCount++;
      if (element.available - element.currentTenantQuota < 0)
        this.improperAllocation++;
     });
    }
    if (tenantSpaceName != "" && this.allocatedSpaceCount > 0 && this.improperAllocation <= 0)
      this.diableConti = "";
    else
      this.diableConti = "disabled";
  }

  closeCreateTenant() {
    this.removeOverFlowHiddenToBodyCss();
    this.modalCreateTenant = false;
    this.addTenant.appPoolsAllocated=[];
  }

  createTenantContinue() {
    this.createTenant = false;
    this.manageTenant = true;
    this.caliculationFlag=false;
  }

  hidemodalManageTenantSpaceTeam() {
    this.manageTenant = false;
    this.createTenant = true;
  }

  editTenant(guid: any) {
    this.isEdit=true;
    this.addOverFlowHiddenToBodyCss();
    this.editTenantModFunc(guid);
    this.modaEditTenantSpaceTeam = true;
    this.diableConti = "";
    this.onLoadOfEditTenant = true;
  }

  editTenantModFunc(guid: any) {
    this.appPoolService.getAppPoolList().subscribe((res: any) => {
      this.appPoolsList = res;

      this.apiService.getTenantById(guid).subscribe((resbyTenId: any) => {
        this.editTenantRecord.id = guid;
        
        

        if(resbyTenId.data && resbyTenId.data.length>0){
        this.editTenantRecord.name = resbyTenId.data[0].name;
        // team members
        this.editTenantRecord.teamMembers=[];
        this.userList=[];
        this.tenantUserList=[];
        this.editTenantRecord.teamMembers=resbyTenId.data[0].teamMembers;
        // this.editTenantRecord.teamMembers.forEach(element => {
        //   this.userList.push({"userId":element.userId,"userName":element.userName,"imageUrl":element.imageUrl,"tenantRoleType":element.tenantRoleType});
        // });
        this.userList=this.editTenantRecord.teamMembers;
        this.tenantUserList=this.editTenantRecord.teamMembers;
        this.updateArray(resbyTenId.data[0]);
        }
        this.editTenantRecord.appPoolsAllocated=[];
        this.appPoolsList.forEach(element => {
          if(element.currentTenantQuota)
          {
          this.editTenantRecord.appPoolsAllocated.push(element);
          }
          else
          {
            element.currentTenantQuota=0;
            element.currentTenantQuotaTemp=0;
            this.editTenantRecord.appPoolsAllocated.push(element);
          }
        });
        // this.editTenantRecord.appPoolsAllocated = this.appPoolsList;
      });
    });
  }

  updateArray(res1: any) {
    this.appPoolsList.forEach(element => {
      res1.appPoolsAllocated.forEach(e1 => {
        if (element.id == e1.id) {
          element.currentTenantQuota = e1.allocatedSpace;
          element.currentTenantQuotaTemp = element.currentTenantQuota;
        }
      });
    });
  }

  saveTenant() {
    this.editTenantRecord.teamMembers=this.tenantUserList;
    if(this.editTenantRecord.name)
    this.editTenantRecord.name=this.editTenantRecord.name.toLowerCase();
    this.apiService.save(this.editTenantRecord.id, this.editTenantRecord).subscribe((data) => {
     this.removeOverFlowHiddenToBodyCss();
      this.modaEditTenantSpaceTeam = false;
      this.toastrService.show("Tenant space " + this.editTenantRecord.name.toLowerCase() + " details are successfully updated");
      this.LoadTenantList();
    });
  }

  hidemodalEditTenantSpaceTeam() {
    this.removeOverFlowHiddenToBodyCss();
    this.modaEditTenantSpaceTeam = false;
    this.editTenantRecord.appPoolsAllocated=[];
    this.isEdit=false;
  }

  deleteTenant(guid: any, tenantName: string) {
    this.tenantIdDelete = guid;
    this.modalDeleteTenant = true
    this.TenantSpaceNameDelete = tenantName;
  }

  confirmDeleteTenant() {
    this.modalDeleteTenant = false;
    this.apiService.deleteTenant(this.tenantIdDelete).subscribe((res: any) => {
      this.toastrService.show("Tenant " + this.TenantSpaceNameDelete + " is successfully deleted");
      this.LoadTenantList();
    });
  }

  closeDeletePopup() {
    this.modalDeleteTenant = false;
  }

  editAllocateTenatSpace(Id: any) {
    this.clsTabActiveAllocate="nav-link active lable-edit-tenat-head-active";
    this.clsTabActiveManage="nav-link active lable-edit-tenat-head-inactive";
    this.clsAllocateModal="tab-pane active";
    this.clsManageTeamModal="tab-pane fade";
    this.manageTenant=false;
  }

  editManageTenatSpace(Id: any) {
    this.clsTabActiveManage="nav-link active lable-edit-tenat-head-active";
    this.clsTabActiveAllocate="nav-link active lable-edit-tenat-head-inactive";
    this.clsManageTeamModal="tab-pane active";
    this.clsAllocateModal="tab-pane fade";
    this.manageTenant=true;
  }

  LoadAppPoolList() {
    this.appPoolService.getAppPoolList().subscribe((res: any) => {
      //var t1 = (new Observable<Array<AppPoolDTO>[]>)res.data;
      this.addTenant.appPoolsAllocated=[];
      res.forEach(element => {
         element.currentTenantQuota=0;
         element.currentTenantQuotaTemp=0;
        this.addTenant.appPoolsAllocated.push(element);
      });
    });
  }

  CreateTenant() {
    this.addTenant.teamMembers=this.tenantUserList;
    console.log(this.tenantUserList);
    if(this.addTenant.name)
    this.addTenant.name=this.addTenant.name.toLowerCase();
    this.apiService.createTenant(this.addTenant).subscribe((data) => {
      this.toastrService.show("Tenant space " + this.addTenant.name.toLowerCase() + " is successfully created");
      this.LoadTenantList();
    });
    this.removeOverFlowHiddenToBodyCss();
    this.modalCreateTenant = false;
    this.createTenant = false;
    this.manageTenant = false;
    this.caliculationFlag=false;
  }
caliculationFlag:boolean=true;
  newtenatspaceallocaton(assingedvalue: number, availablevalue: number, tenantInput: string, actionType: string, tenant: AppPoolListItem = null) {
    //Modify SOmething
    // if(tenant != null)
    // {
    //   if(tenant.available > assingedvalue)
    //   {
    //     this.editTenantRecord.appPoolsAllocated.filter(i => i.id == tenant.id)[0].available 
    //   }
    // }


    //

    this.onLoadOfEditTenant = false;
    this.allocatedSpaceCount = 0;
    this.improperAllocation = 0;
    tenantInput = tenantInput.trim();
    // if ((availablevalue - assingedvalue) < 0) {
    //   this.diableConti = "disabled";
    //   //AllocationForNewTenanat_tenantname
    // }
    // else {

      if (actionType == 'add') {
        this.addTenant.appPoolsAllocated.forEach(element => {
          if (element.currentTenantQuota > 0)
            this.allocatedSpaceCount++;
          if (element.available - element.currentTenantQuota < 0)
            this.improperAllocation++;
        });
      }
      else if (actionType == 'edit') {
        tenantInput = this.editTenantRecord.name.trim();
        this.editTenantRecord.appPoolsAllocated.forEach(element => {
          if (element.currentTenantQuota > 0)
            this.allocatedSpaceCount++;
          if((element.capacity-element.allocatedSpaces)<(element.currentTenantQuota-element.currentTenantQuotaTemp))
          this.improperAllocation++;
        });
      }
      //AllocationForNewTenanat_tenantname
      if (this.improperAllocation <= 0 && tenantInput != "" && this.allocatedSpaceCount > 0){
        this.diableConti = "";       
      }
      else{
        this.diableConti = "disabled";
      }
      
    //}
  }


  // searchByTenantNameInGrid(searcText:string){
  //   this.searchTenantNameText = searcText.length;
  // }
  updateFilter(event) {
    //alert('filter');
    this.keyword = event.target.value.toLowerCase();
    // commented to get the data from API

    // // filter our data
    // const temp = this.tenantListViewTemp.filter(function (d) {
    //   return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    // });

    // // update the rows
    // this.tenantListView = temp;
    // // Whenever the filter changes, always go back to the first page
    // // this.table.offset = 0;
    
    this.tenantListView=[];
    this.tenantListViewTemp=[];
    this.apiService.getAllTenantList(this.pageNumber,this.fieldName, this.isAscendingSort,this.pageSize,this.keyword).subscribe((res: any) => {
     if(res.data.items!=null)
     {     

      this.tenantListView = res.data.items;
      this.tenantListViewTemp = res.data.items;
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

  focus() {
    this.showserarchImage = true;
    this.hideSortByTenantName = false;
  }

  focusout() {
    this.showserarchImage = false;
    this.hideSortByTenantName = true;
  }

  onFooterPageSizeChange(pageSize: any) {

    //grid footer fixed height
    let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

    // if (tblBody.length != 0) {
    //   let height = (66 * pageSize);
    //   tblBody[0].style.height = height.toString() + "px";
    // }
    this.pageSize=pageSize;
    this.pageNumber=1;

    this.apiService.getAllTenantList(this.pageNumber,this.fieldName, this.isAscendingSort,this.pageSize,this.keyword).subscribe((res: any) => {
      this.tenantListView = res.data.items;
      this.tenantListViewTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;

      this.pageSize = pageSize;
     // this.pageNumber = 1;

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

      this.apiService.getAllTenantList(this.pageNumber,this.fieldName, this.isAscendingSort,this.pageSize,this.keyword).subscribe((res: any) => {
        if(res.data.items!=null){

      this.tenantListView = res.data.items;
      this.tenantListViewTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;

      //this.pageSize = 10;
      this.pageNumber = currentPageNumber;

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
fieldName:string="CreatedDate";
 isAscendingSort:any=false;

  gridSort(fieldName: any, sortDirection: any) {
    if (fieldName == "TenantName") {
      this.sortByDate = false;
      this.sortByTenantName = true;
      this.createdDateDsc = false;
      this.tenantNameDsc = (this.tenantNameDsc == true ? false : true);
    }
    else if (fieldName == "CreatedDate") {
      this.sortByTenantName = false;
      this.sortByDate = true;
      this.tenantNameDsc = false;
      this.createdDateDsc = (this.createdDateDsc == true ? false : true);
    }
    
    if(sortDirection=="Descending")
    this.isAscendingSort=false;
    else
    this.isAscendingSort=true;
    this.fieldName=fieldName;
    
    this.apiService.getAllTenantList(this.pageNumber,this.fieldName, this.isAscendingSort,this.pageSize,this.keyword).subscribe((res: any) => {
      this.tenantListView = res.data.items;
      this.tenantListViewTemp = res.data.items;
    });
  }

  addOverFlowHiddenToBodyCss()
  {
    //add overflow hidden to body on modal open
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("overflowFixed");   //add the class
  }
  removeOverFlowHiddenToBodyCss()
  {
    //remove overflow hidden for body on modal close
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("overflowFixed");   //remove the class
  }
  objChanged(event:any)
  {
  }

  public onSearchChange(searchvalue: any, isEdit:boolean) {
    if(searchvalue.length>=3)
    {
      var selectedTenantId;
      if(this.isEdit)
      selectedTenantId=this.editTenantRecord.id;
      else
      selectedTenantId="";

        this.userService.searchUsers(searchvalue,selectedTenantId,null,1).subscribe((result: any) => {
          this.userList=[];
          this.userList = result.data;
      });
    }
    else
    {
      if(this.isEdit && this.editTenantRecord && this.editTenantRecord.teamMembers && this.editTenantRecord.teamMembers.length>0)
      {
        this.userList=[];
        this.userList=this.editTenantRecord.teamMembers;
      // this.editTenantRecord.teamMembers.forEach(element => {
      //   this.userList.push({"userId":element.userId,"userName":element.userName,"imageUrl":element.imageUrl,"tenantRoleType":element.tenantRoleType?1:0});
      // });
    }
    }
  }
  addToTenantUsers(user:any)
  {
    if(this.tenantUserList && this.tenantUserList.length>=0 && this.tenantUserList.filter(
      x => x.userId == user.userId).length<=0) 
      this.tenantUserList.push(user);
    // this.tenantUserList.push({"userId":user.userId,"imageUrl":user.imageUrl,"tenantRoleType":user.tenantRoleType,"userName":user.userName,"isActive":true});
    else if(!this.tenantUserList)
    {
    this.tenantUserList=[];
    this.tenantUserList.push(user);
    //this.tenantUserList.push({"userId":user.userId,"imageUrl":user.imageUrl,"isOwner":(user.tenantRoleType==0),"isReader":(user.tenantRoleType==1),"userName":user.userName,"isActive":true});
    }
    else
    {
      this.tenantUserList=this.tenantUserList.filter(x => x.userId != user.userId);
      this.tenantUserList.push(user);
      // this.tenantUserList.push({"userId":user.userId,"imageUrl":user.imageUrl,"isOwner":(user.tenantRoleType==0),"isReader":(user.tenantRoleType==1),"userName":user.userName,"isActive":true});
    }
    // localStorage.setItem("tenantUsers",JSON.stringify(this.tenantUserList));
  }
  filterUsersBasedOnRole(tenantUserList:any[],role:number)
  {
    if(tenantUserList && tenantUserList.length>0 && role==TenantRoleType.tenantReader)
    return tenantUserList.filter(item=>item.roleType==TenantRoleType.tenantReader);
    else if(tenantUserList && tenantUserList.length>0 && role==TenantRoleType.tenantOwner)
    return tenantUserList.filter(item=>item.roleType==TenantRoleType.tenantOwner);
    else
    return [];
  }
  removeTheUser(userId:string)
  {
    this.tenantUserList = this.tenantUserList.filter(item=>item.userId!=userId);
    this.userList = this.userList.filter(item=>item.userId!=userId);
  }
  unassignTheUser(user:any)
  {
    this.userService.unassignUser(user.id,"tenantUser",this.editTenantRecord.id,user.roleType).subscribe((data) => {
      this.toastrService.show("The user has successfully removed from the role");
      this.tenantUserList = this.tenantUserList.filter(item=>item.userId!=user.userId);
      this.userList = this.userList.filter(item=>item.userId!=user.userId);
    });
  }
}
