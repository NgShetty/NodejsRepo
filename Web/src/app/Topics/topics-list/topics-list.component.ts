import { Component, OnInit } from '@angular/core';
import { AddTopic, EditTopic } from '../_models/Topics';
import { Router, NavigationExtras } from '@angular/router';
import { TopicService } from '../topic.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { Roles } from 'src/app/Users/_models/user';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';
import { TenantService } from 'src/app/Tenant/tenant.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.css']
})
export class TopicsListComponent implements OnInit {

  totalCount: number = 0;
  itemsCount: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  sortByTopic: boolean = false;
  hideSortByTopic: boolean = true;
  topicDsc: boolean = true;
  topicList : Array<AddTopic> = new Array<AddTopic>(); 
  topicListTemp : Array<AddTopic> = new Array<AddTopic>(); 
  topicListView: any;
  selectedTopicDTO:AddTopic=new AddTopic();
  showDeleteModal: boolean=false;
  actionType:string = "";
  sortByDate:boolean = false;
  createdDateDsc:boolean = false;
  showCreateTopicModal:boolean = false;
  showEditTopicModal:boolean=false;
  roles=Roles;
  tenantList: TenantListItem[]=[];
  isSystemUser: boolean=false;
  selectedTenantId:any;
  constructor(private router: Router, private topicService: TopicService, private toastr: ToastrService, private loader: LoaderService, private tenantService: TenantService, private authService: AuthenticationService ) {
    

  }

  ngOnInit() {
    this.loadTenants();
    // this.LoadTopics();
  }
  loadTenants()
  {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
      this.tenantList=res.data.items;
      this.authService.userRole.subscribe((data) => {
        if(data.indexOf(Roles.SystemAdmin) === -1 && data.indexOf(Roles.SystemReader) === -1){
         this.isSystemUser=false;
         if(res.data.items && res.data.length>0)
         this.selectedTenantId=res.data.items[0].id;
         this.onChange(null,res.data.items[0].id,res.data.items[0].name);
        }
        else{
         this.isSystemUser=true;
         this.selectedTenantId=0;
         this.LoadTopics(this.selectedTenantId);
        }
       });
    });
  }
  LoadTopics(selectedTenantId) {
    this.loader.show();
    this.topicList=null;
    this.topicListTemp=null;
    this.pageSize = 10;
    this.pageNumber = 1
    this.topicService.getAllTopicList(selectedTenantId,"210a5134-c305-4e43-b63e-a70a96ab754d",this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize).subscribe((res: any) => {
      this.loader.hide();
      this.topicList = res.data.items;
      this.topicListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;
    
      this.startPageNumber = this.pageNumber;
      this.endPageNumber = this.pageSize;
      if(this.endPageNumber>this.totalCount)
        this.endPageNumber=this.totalCount;
      
      //grid footer fixed height
  //  let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

  //  if (tblBody.length != 0) {
  //    let height=(66 * this.pageSize);
  //    tblBody[0].style.height = height.toString() + "px";
  //  }
    });
  }

  onActivate(value: any)
  {
    if(value.type == 'click') {
      let navigation : NavigationExtras = {
        queryParams : {
          "id" : value.row.id
        }
      }

      if(this.actionType == "Edit")
      {
      //this.router.navigate(["application/edit"], navigation);
      return;
      }
      if(this.actionType == "Delete")
      {
       // this.modalDeleteApplicatoin = true
        return;
      }
      // else  
      // this.router.navigate(["application/viewapplication"], navigation);
    }    
  }

  close($event)
  {
    //remove overflow hidden for body on modal close
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("overflowFixed");   //remove the class
    
    if($event=="Edit")
    {
      this.showEditTopicModal=!$event;
    }
    else if($event=="Delete")
    {
      this.showDeleteModal=!$event;
    }
    else if($event=="Add")
    {
      this.showCreateTopicModal=!$event;
    }
    this.LoadTopics(this.selectedTenantId);
  }

  openCreateTopicModal()
  {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    // console.log(modifiedObj);
    this.selectedTopicDTO=new AddTopic();
    this.showCreateTopicModal=true;
  }
  openEditTopicModal(modifiedObj:any)
  {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    console.log(modifiedObj);
    this.selectedTopicDTO=new EditTopic();
    this.selectedTopicDTO=modifiedObj;
    this.showCreateTopicModal=true;
  }
  openDeleteTopicModal(modifiedObj:any)
  {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    console.log(modifiedObj);
    this.selectedTopicDTO=modifiedObj;
    this.showDeleteModal=true;
  }
   isAscendingSort:any=false;
   fieldName:string="CreatedDate";
  gridSort(fieldName:any, sortDirection:any)
  {
    if(fieldName == "TopicName")
    {
      this.sortByDate =false;
      this.sortByTopic = true;
      this.createdDateDsc = false;
      this.topicDsc = (this.topicDsc == true ? false : true);
    }
    else if(fieldName == "CreatedDate")
    {
      this.sortByTopic = false;
      this.sortByDate = true;
      this.topicDsc = false;
      this.createdDateDsc = (this.createdDateDsc == true ? false : true);
    } 
    
    if(sortDirection=="Descending")
    this.isAscendingSort=false;
    else
    this.isAscendingSort=true;
    this.fieldName=fieldName;
    this.topicService.getAllTopicList(this.selectedTenantId,"all",this.pageNumber,this.fieldName, this.isAscendingSort,this.pageSize).subscribe((res: any) => {
      this.topicList = res.data.items;
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

      let  currentPageNumber  = 1;
      if(value != "" && value.page == undefined)
      currentPageNumber = value;
      else if(value != "")
      currentPageNumber= value.page;     
  
     this.topicService.getAllTopicList(this.selectedTenantId,"all",currentPageNumber,this.fieldName,this.isAscendingSort,this.pageSize).subscribe((res: any) => {
       if(res.data.items!=null){  
      this.topicList = res.data.items;
      this.topicListTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;
  
      this.pageSize = 10;
      this.pageNumber = currentPageNumber;
      
      if(this.pageNumber != 1)
      {
      this.startPageNumber = ((this.pageNumber -1) * this.pageSize) + 1 ;
      this.endPageNumber = ((this.pageNumber - 1) * this.pageSize) + this.pageSize ;
      if(this.endPageNumber>this.totalCount)
      this.endPageNumber=this.totalCount;
      
      } 
      else
      {
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
  //  let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

  //  if (tblBody.length != 0) {
  //    let height=(66 * pageSize);
  //    tblBody[0].style.height = height.toString() + "px";
  //  }
   this.pageNumber=1;
   this.pageSize=pageSize;

      this.topicService.getAllTopicList(this.selectedTenantId,"all",this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize).subscribe((res: any) => {
   
       this.topicList = res.data.items;
       this.topicListTemp = res.data.items;
       this.totalCount = res.data.totalCount;
       this.itemsCount = res.data.itemsCount;
   
       this.pageSize = pageSize;
       this.pageNumber = 1;
        
       if(this.pageNumber != 1)
       {
       this.startPageNumber = ((this.pageNumber -1 )* this.pageSize) + 1 ;
       this.endPageNumber = ((this.pageNumber -1) * this.pageSize) + this.pageSize ;
       if(this.endPageNumber>this.totalCount)
       this.endPageNumber=this.totalCount;
       } 
       else
       {
         this.startPageNumber = this.pageNumber;
         this.endPageNumber = this.pageSize;
         if(this.endPageNumber>this.totalCount)
         this.endPageNumber=this.totalCount;
       }
     });
     }

     changeStatus(topic:any)
     {
      topic.associatedAppId=topic.associatedApplication.application.id;
      this.topicService.save(topic.id,topic,topic.associatedAppId).subscribe((data) => {
        if(!topic.topicStatus)
      this.toastr.show("Topic has disabled successfully");
      else
      this.toastr.show("Topic has enabled successfully");
      });
     }

     onChange(args: any, selectedTenantId: any, selectedTenantName: any) {
      this.topicListView=null;
      let tenantId;
      if(!selectedTenantId)
      tenantId = args.target.value;
      else
      tenantId=selectedTenantId;
      this.selectedTenantId=tenantId;
     
      if (tenantId == 0) {
        // this.dasableCreateApplication = true;
        this.LoadTopics(tenantId);
      }
      else {
        this.LoadTopics(tenantId);
        
      }
    }

}
