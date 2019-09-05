import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NotificationService } from '../notification.service';
import { NotificationAdd, NotificationEdit, NotificationListItem } from '../_models/notification-details';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { Roles } from 'src/app/Users/_models/user';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';
import { TenantService } from 'src/app/Tenant/tenant.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';

@Component({
  selector: 'app-notification-list-view',
  templateUrl: './notification-list-view.component.html',
  styleUrls: ['./notification-list-view.component.less']
})
export class NotificationListViewComponent implements OnInit {
  totalCount: number = 0;
  itemsCount: number = 0;
  showserarchImage: boolean = false;
  showserarchImageForApp: boolean = false;
  searchApplicationNameText: number = 0;
  searchUserNameText: number = 0;
  public query: NgModel;
  public queryApp: NgModel;
  sortByApplicationName: boolean = false;
  hideSortByApplicationName: boolean = true;
  sortByApp: boolean = false;
  appNameDsc: boolean = true;
  // notificationList: Array<NotificationAdd> = new Array<NotificationAdd>();
  notificationList: Array<NotificationListItem>= new Array<NotificationListItem>();
  notificationListTemp: Array<NotificationListItem> = new Array<NotificationListItem>();
  notificationListView: any;
  selectedNotificationDTO: NotificationAdd = new NotificationAdd();
  manualEdit: boolean = false;
  showDeleteModal: boolean = false;
  actionType: string = "";
  sortByDate: boolean = false;
  createdDateDsc: boolean = false;
  showViewModal: boolean = false;
  showEditModal: boolean = false;
  showModal: boolean = false;
  notificationObj: any;
  editMode: boolean;
  isScheduledChecked: boolean = false;
  @ViewChild('notificationTable') table: any;
  hasGroups: boolean = false;
  hasTopics: boolean = false;
  hasVersions: boolean = false;
  roles=Roles;
  tenantList: TenantListItem[]=[];
  selectedTenantId:any="";
  isSystemUser:boolean=false;

  fieldName:string="CreatedDate";
 isAscendingSort:any=false;
 pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  keyWord:string="";

  clsSent:string="btn btn-secondary clsSent active";
  clsScheduled:string="btn clsScheduled btn-secondary";
  constructor(private router: Router, private notificationService: NotificationService, private loader: LoaderService, private tenantService: TenantService, private authService: AuthenticationService ) {
   
  }

  ngOnInit() {
    this.loader.show();
    this.loadTenants();
    // this.LoadNotifications(this.selectedTenantId, false);
  }
  loadTenants()
  {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
      this.tenantList=res.data.items;
      this.authService.userRole.subscribe((data) => {
        if(data.indexOf(Roles.SystemAdmin) === -1 && data.indexOf(Roles.SystemReader) === -1){
         this.isSystemUser=false;
         if(res.data && res.data.items && res.data.items.length>0)
         this.selectedTenantId=res.data.items[0].id;
         this.onChange(null,res.data.items[0].id,res.data.items[0].name);
        }
        else{
         this.isSystemUser=true;
         this.selectedTenantId="";
         this.LoadNotifications(this.selectedTenantId,false);
        }
       });
    });
  }
  LoadNotifications(tenantId:any, isScheduled: boolean) {
    this.pageSize = 10;
    this.pageNumber = 1;
    this.isScheduledChecked=isScheduled;

    this.notificationService.getAllNotificationList(tenantId,null,isScheduled,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.loader.hide();
      this.notificationList=null;
      this.notificationListTemp=null;
      this.notificationList = res.data.items;
      this.notificationListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;     
      this.startPageNumber = this.pageNumber;
      this.endPageNumber = this.pageSize;
      if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;

      //check if the groups/versions/topics categories exists
      

     //grid footer fixed height
    // let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

    // if (tblBody.length != 0) {
    //   let height = (66 * this.pageSize);
    //   tblBody[0].style.height = height.toString() + "px";
    // }
    });

    //remove resizing columns
    let tblHeader = document.getElementsByClassName('resizeable') as HTMLCollectionOf<HTMLElement>;
    if (tblHeader.length != 0) {
      for(var i =0; i > tblHeader.length; i++)
      {
        tblHeader[i].classList.remove('resizeable');
      }
    }
    
  }

  
  close($event) {
    //remove overflow hidden for body on modal close
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("overflowFixed");   //remove the class

    if ($event == "Add") {
      this.showModal = !$event;
    }
    else if ($event == "Edit") {
      this.showEditModal = !$event;
    }
    else if ($event == "Delete") {
      this.showDeleteModal = !$event;
    }
    else if ($event == "View") {
      this.showViewModal = !$event;
    }
   this.LoadNotifications(this.selectedTenantId, false);
  }

  openNotificationModal(modifiedObj: any) {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    // console.log(modifiedObj);
    this.notificationObj = new NotificationAdd();
    this.showModal = true;
    this.editMode = false;
  }
  openModalToEditNotification(event:any, selectedRow: any) {
    //suppress parent click event
     event.stopPropagation();
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    console.log(selectedRow);
    this.notificationObj = new NotificationEdit();
   
    this.notificationService.getNotificationsListById(this.selectedTenantId, selectedRow.id).subscribe((res: any) => 
    {
        this.notificationObj = res.data;
        this.editMode = true;
        this.showModal = true;
    });
  }

  onActivate(value: any)
  {
    if (value.type == 'click') {
    this.openViewNotificationModal(value.row);
    }
  }
  openViewNotificationModal(selectedRow: any) {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    this.notificationService.getNotificationsListById(this.selectedTenantId, selectedRow.id).subscribe((res: any) => 
    {
      console.log(selectedRow);
      this.selectedNotificationDTO = res.data;
      this.showViewModal = true;
      this.editMode = false;
    });
   
  }
  deleteNotification(event: any, selectedRow: any) {
    //suppress parent click event
    event.stopPropagation();
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class
     
    this.notificationService.getNotificationsListById(this.selectedTenantId, selectedRow.id).subscribe((res: any) => 
    {
      this.selectedNotificationDTO = res.data;
      this.showDeleteModal = true;
      this.editMode = false;
    });
  }

  focus(fieldName: any) {
    if (fieldName == "Application") {
      this.showserarchImageForApp = true;
      this.hideSortByApplicationName = false;
    }
  }

  focusout(fieldName: any) {
    if (fieldName == "Application") {
      this.showserarchImageForApp = false;
      this.hideSortByApplicationName = true;
    }
  }

  updateFilter(event, fieldName: any) {
    // //alert('filter');

     this.keyWord = event.target.value;


    // if (fieldName == "ApplicationName") {
    //   const temp = this.notificationListTemp.filter(function (d) {
    //     return d.application.name.indexOf(val) !== -1 || !val;
    //   });
    //   // update the rows
    //   this.notificationList = temp;
    this.notificationList=[];
    this.notificationListTemp=[];
    this.notificationService.getAllNotificationList(this.selectedTenantId,null,this.isScheduledChecked,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      if(res.data.items!=null){
       this.notificationList = res.data.items;
      this.notificationListTemp = res.data.items;
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
    
    // Whenever the filter changes, always go back to the first page
  }

  gridSort(fieldName: any, sortDirection: any) {
    if (fieldName == "ApplicationName") {
      this.sortByDate = false;
      this.sortByApp = true;
      this.createdDateDsc = false;
      this.appNameDsc = (this.appNameDsc == true ? false : true);
    }
    else if (fieldName == "CreatedDate") {
      this.sortByApp = false;
      this.sortByDate = true;
      this.appNameDsc = false;
      this.createdDateDsc = (this.createdDateDsc == true ? false : true);
    }
    
    if(sortDirection=="Descending")
    this.isAscendingSort=false;
    else
    this.isAscendingSort=true;
    this.notificationService.getAllNotificationList(this.selectedTenantId,null,this.isScheduledChecked,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.notificationList=null;
      this.notificationList = res.data.items;
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

    this.notificationService.getAllNotificationList(this.selectedTenantId,null,this.isScheduledChecked,currentPageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      if(res.data.items!=null){
      this.notificationList=null;
      this.notificationListTemp=null;

      this.notificationList = res.data.items;
      this.notificationListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;

      this.pageSize = 10;
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

  onFooterPageSizeChange(pageSize: any) {

    //grid footer fixed height
    // let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

    // if (tblBody.length != 0) {
    //   let height = (66 * pageSize);
    //   tblBody[0].style.height = height.toString() + "px";
    // }
    this.pageSize=pageSize;
    this.pageNumber=1;

    this.notificationService.getAllNotificationList(this.selectedTenantId,null,this.isScheduledChecked,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.notificationList=null;
      this.notificationListTemp=null;

      this.notificationList = res.data.items;
      this.notificationListTemp = res.data.items;
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
  loadScheduledNotifications(event:any)
  {
    this.loader.show();
      this.clsScheduled="btn clsScheduled btn-secondary active";
      this.clsSent="btn btn-secondary clsSent";
      this.notificationList=null;
      this.isScheduledChecked=true;
      this.LoadNotifications(this.selectedTenantId, true);
  }
  loadSentNotifications(event:any)
  {
    this.loader.show();
    this.clsScheduled="btn clsScheduled btn-secondary";
    this.clsSent="btn btn-secondary clsSent active";
      this.notificationList=null;
      this.isScheduledChecked=false;
      this.LoadNotifications(this.selectedTenantId, false);
  }
  onChange(args: any, selectedTenantId: any, selectedTenantName: any) {
    let tenantId;
    if(!selectedTenantId)
    tenantId = args.target.value;
    else
    tenantId=selectedTenantId;
    this.selectedTenantId=tenantId;
   
    if (tenantId == 0) {
      // this.dasableCreateApplication = true;
      this.LoadNotifications(tenantId,this.isScheduledChecked);
    }
    else {
      this.LoadNotifications(tenantId,this.isScheduledChecked);
      
    }
  }
}
