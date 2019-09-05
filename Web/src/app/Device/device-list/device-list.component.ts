import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { DeviceService } from '../device.service';
import { DeviceDTO } from '../_models/device';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { Roles } from 'src/app/Users/_models/user';
import { TenantService } from 'src/app/Tenant/tenant.service';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  totalCount: number = 0;
  itemsCount: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  showserarchImage: boolean = false;
  showserarchImageForApp: boolean = false;
  searchAppNameText: number = 0;
  searchUserNameText: number = 0;
  public query: NgModel;
  public queryApp: NgModel;
  sortByUsername: boolean = false;
  hideSortByUsername: boolean = true;
  usernameDsc: boolean = true;
  deviceList: Array<DeviceDTO> = new Array<DeviceDTO>();
  deviceListTemp: Array<DeviceDTO> = new Array<DeviceDTO>();
  deviceListView: any;
  selectedDeviceDTO: DeviceDTO = new DeviceDTO();
  manualEdit: boolean = false;
  showDeleteModal: boolean = false;
  actionType: string = "";
  sortByDate: boolean = false;
  createdDateDsc: boolean = false;
  roles=Roles;
  tenantList: Array<TenantListItem> = new Array<TenantListItem>();
  selectedTenantId:any;

  fieldName:string="CreatedDate";
 isAscendingSort:any=false;
 keyWord:string="";


  showEditTokenModal: boolean = false;
  constructor(private router: Router, private deviceService: DeviceService, private toastr: ToastrService,private tenantService: TenantService, private loader: LoaderService,private authService: AuthenticationService) {
   // this.LoadDevices(null);
    this.LoadTenantList();
    
  }

  ngOnInit() {
  }

  LoadDevices(selectedDevice) {
    this.deviceList=null;
    this.deviceListTemp=null;
    this.loader.show();
    this.deviceService.getAllDeviceList(this.selectedTenantId,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.loader.hide();
      this.deviceList = null;
      this.deviceListTemp = null;
      this.deviceList = res.data.items;
      this.deviceListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;
      this.pageSize = 10;
      this.pageNumber = 1
      this.startPageNumber = this.pageNumber;
      this.endPageNumber = this.pageSize;
      if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;

      //grid footer fixed height
      // let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

      // if (tblBody.length != 0) {
      //   let height = (66 * this.pageSize);
      //   tblBody[0].style.height = height.toString() + "px";
      // }
    });
  }

  LoadTenantList() {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
    this.tenantList = [];
      this.tenantList = res.data.items;     
      this.authService.userRole.subscribe((data) => {
        if(data.indexOf(Roles.SystemAdmin) === -1 && data.indexOf(Roles.SystemReader) === -1){        
         if(res.data && res.data.items && res.data.items.length>0)
         this.selectedTenantId=res.data.items[0].id;
         this.onChange(null,res.data.items[0].id,res.data.items[0].name);
         this.LoadDevices(this.selectedTenantId);
        }
        else{        
         this.selectedTenantId="all";    
         this.LoadDevices(this.selectedTenantId);
        }
       });   
    });    
  }
  onChange(args: any, selectedTenantId: any, selectedTenantName: any) {  
    let  tenantId;
    if(!selectedTenantId)
    tenantId = args.target.value;
    else
    tenantId=selectedTenantId;
    this.selectedTenantId=tenantId;
    this.LoadDevices(tenantId);
  }

  onActivate(value: any) {
    if (value.type == 'click') {
      let navigation: NavigationExtras = {
        queryParams: {
          "id": value.row.id
        }
      }

      if (this.actionType == "Edit") {
        //this.router.navigate(["application/edit"], navigation);
        return;
      }
      if (this.actionType == "Delete") {
        // this.modalDeleteApplicatoin = true
        return;
      }
      // else  
      // this.router.navigate(["application/viewapplication"], navigation);
    }
  }

  close($event) {
    //remove overflow hidden for body on modal close
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("overflowFixed");   //remove the class

    if ($event == "Edit") {
      this.showEditTokenModal = !$event;
    }
    else if ($event == "Delete") {
      this.showDeleteModal = !$event;
    }

    this.LoadDevices(null);
  }

  //remove this
  openModalToEditToken(modifiedObj: any) {
      //add overflow hidden to body on modal open
      let body = document.getElementsByTagName('body')[0];
      body.classList.add("overflowFixed");   //add the class
      
    console.log(modifiedObj);
    this.selectedDeviceDTO = modifiedObj;
    this.manualEdit = (modifiedObj.newNotificationToken != modifiedObj.oldNotificationToken);
    this.showEditTokenModal = true;
  }
  deleteDevice(modifiedObj: any) {
      //add overflow hidden to body on modal open
      let body = document.getElementsByTagName('body')[0];
      body.classList.add("overflowFixed");   //add the class
      
    console.log(modifiedObj);
    this.selectedDeviceDTO = modifiedObj;
    this.showDeleteModal = true;
  }

  focus(fieldName: any) {
    if (fieldName == "Username") {
      this.showserarchImage = true;
      this.hideSortByUsername = false;
    }
    else if (fieldName == "Application") {
      this.showserarchImageForApp = true;
    }
  }

  focusout(fieldName: any) {
    if (fieldName == "Username") {
      this.showserarchImage = false;
      this.hideSortByUsername = true;
    }
    else if (fieldName == "Application") {
      this.showserarchImageForApp = false;
    }
  }

  updateFilter(event, fieldName: any) {
    //alert('filter');

    const val = event.target.value;

    // filter our data
    if (fieldName == "UserID") {
      const temp = this.deviceListTemp.filter(function (d) {
        return d.userID.indexOf(val) !== -1 || !val;
      });
      // update the rows
      this.deviceList = temp;
    }

    if (fieldName == "ApplicationName") {
      // const temp = this.deviceListTemp.filter(function (d) {
      //   return d.associatedApplication.application.name.indexOf(val) !== -1 || !val;
      // });
      // // update the rows
      // this.deviceList = temp;
      this.keyWord=event.target.value;
      this.deviceList = [];
        this.deviceListTemp = [];
      this.deviceService.getAllDeviceList(this.selectedTenantId,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
        if(res.data.items!=null){

        this.deviceList = res.data.items;
        this.deviceListTemp = res.data.items;
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
    // Whenever the filter changes, always go back to the first page
  }

  gridSort(fieldName: any, sortDirection: any) {
    if (fieldName == "UserID") {
      this.sortByDate = false;
      this.sortByUsername = true;
      this.createdDateDsc = false;
      this.usernameDsc = (this.usernameDsc == true ? false : true);
    }
    else if (fieldName == "CreatedDate") {
      this.sortByUsername = false;
      this.sortByDate = true;
      this.usernameDsc = false;
      this.createdDateDsc = (this.createdDateDsc == true ? false : true);
    }
    
    if(sortDirection=="Descending")
    this.isAscendingSort=false;
    else
    this.isAscendingSort=true;
    this.deviceService.getAllDeviceList(this.selectedTenantId,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.deviceList = res.data.items;
    });
  }

  deleteDevice1(guid: any, applicationName: string) {
    // this.actionType = "Delete";
    // this.ApplicationIdDelete = guid;
    // this.ApplicationName = applicationName;
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
     
      this.deviceService.getAllDeviceList(this.selectedTenantId,currentPageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      if(res.data.items!=null){
        this.deviceList=null
        this.deviceListTemp=null
      this.deviceList = res.data.items;
      this.deviceListTemp = res.data.items;
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

    //grid footer fixed height
    // let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

    // if (tblBody.length != 0) {
    //   let height = (66 * pageSize);
    //   tblBody[0].style.height = height.toString() + "px";
    // }
    this.pageSize=pageSize;
    this.pageNumber=1;

    this.deviceService.getAllDeviceList(this.selectedTenantId,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {

      this.deviceList = res.data.items;
      this.deviceListTemp = res.data.items;
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

  deviceStatus(deviceObj: DeviceDTO) {
var isEnabled=deviceObj.isEnabled;
    this.deviceService.save(deviceObj.id, deviceObj).subscribe((data) => {
      if (!isEnabled)
        this.toastr.show("Device has disabled successfully");
      else
        this.toastr.show("Device has enabled successfully");
    });
  }
}
