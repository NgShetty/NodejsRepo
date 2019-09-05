import { Component, OnInit } from '@angular/core';
import { ChartType, PointStyle, ChartOptions } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { ApplicationReport, ActiveDevices, ApplicationTopics, NotificationStatus, ReportRequestBody } from './models/report';
import { Roles } from '../Users/_models/user';
import { TenantService } from '../Tenant/tenant.service';
import { ApplicationService } from '../Application/application.service';
import { ReportsService } from './reports.service';
import { LoaderService } from '../shared/loader/loader.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  selectedFilter: string = "";
   doughnutChartData: MultiDataSet = [
    [300,200]
  ];
   doughnutChartLabels: Label[] = ['Total Android devices - ' + this.doughnutChartData[0][0], 'Total iOs devices - ' + this.doughnutChartData[0][1]];
   colors: Array<string> = ["#86BC25","#62B5E5","#43B02A","#A7A8AA"];
   topicColors:Array<any> = [{backgroundColor : ["#86BC25","#62B5E5","#43B02A","#A7A8AA"],hoverBackgroundColor: ["#86BC25","#62B5E5","#43B02A","#A7A8AA"],
   hoverBorderColor: ["#86BC25","#62B5E5","#43B02A","#A7A8AA"]}];
   chartColors: Array<any> = [
    {
      backgroundColor: ['#86BC25', '#0076A8'],
      hoverBackgroundColor: ['#86BC25', '#0076A8'],
      hoverBorderColor: ['#86BC25', '#0076A8'],
      cutoutPercentage: 4000

    }
  ];
   doughnutChartType: ChartType = 'doughnut';
   pointStyle: PointStyle = 'rectRounded';
   chartOptions: ChartOptions = {
    responsive: true,
    cutoutPercentage: 75,
    legend: {
      display: false
      // ,position: 'right',
      // labels: {
      //     fontColor: '#000',
      //     boxWidth: 16               
      // }
    }
  };
  myChart: HTMLCanvasElement;
  ctx: HTMLCanvasElement;
  applicationReport : Array<ApplicationReport> = new Array<ApplicationReport>();

  //footer
  itemsCount: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  totalCount: number = 0;

  dropdownList = [];
  selectedItems = [];

  chkDiscard: boolean = false;
  chkDiscardApp:boolean = false;
  tenantDropdownSettings: {};
  appDropdownSettings: {};
  platformDropdownSettings: {};
  notificationDropdownSettings: {};
  selectedTenantsList: Array<any> = [];
  selectedAppsList: Array<any> = [];
  selectedPlatformList: Array<any> = []; 
  selectedNotificationList: Array<any> = []; 
  tenantList: Array<any>=[];
  platformList: Array<any>=[];
  applicationList: Array<any>=[];
  notificationList: Array<any>=[];
  roles=Roles;
  activeDeviceList: any[]=[];
  isInitialLoad: boolean=true;
  dropdownSettings:{};
  activeDeviceListTemp: any[]=[];
  topicList: ApplicationTopics[]=[];
  selectedDay: any;
  notificationStatus: NotificationStatus;
  filteredPayload: ReportRequestBody;
  selectedNotificationId: any;
  constructor(private tenantService: TenantService, private appService: ApplicationService, private reportService: ReportsService, private loader: LoaderService, private notificationService: NotificationService) {
    this.selectedFilter = "activeDevices";
    this.applicationReport = [
      {"name": "Alerts", "totalTopics": 650, "topicsCount" : [[300,200,100,50]], "topicNames": ["Sed ut perspiciatis unde", "Why use external it support", "Baby Monitor Technology","Others"] },
      {"name": "Aspire", "totalTopics": 1210, "topicsCount" : [[800,200,200,100]], "topicNames": ["Sed ut perspiciatis unde", "Baby Monitor technology", "Becoming a DVD repair expert online","Others"]},
      {"name": "Parking", "totalTopics": 800, "topicsCount" : [[600,200]], "topicNames": ["Sed ut perspiciatis unde", "Baby Monitor technology"]},
    ];

    // this.activeDeviceList=[
    // {"id":123,"appVersion":1.0,"applicationName":"Aspire","isDeleted":false,"isEnabled":true,"platform":"Android","userID":1},
    // {"id":123,"appVersion":1.0,"applicationName":"Aspire","isDeleted":false,"isEnabled":true,"platform":"Android","userID":1},
    // {"id":123,"appVersion":1.0,"applicationName":"Aspire","isDeleted":false,"isEnabled":true,"platform":"Android","userID":1},
    // ];

    


    this.totalCount = this.applicationReport.length;
      this.itemsCount = this.applicationReport.length;
      this.pageSize = 10;
      this.pageNumber = 1
      this.startPageNumber = this.pageNumber;
      this.endPageNumber = this.pageSize;
  }

  ngOnInit() {
    this.loadTenants();
  // this.tenantList = [{"id": 1, "name" : "ten1"},{"id": 2, "name" : "ten2"},{"id": 3, "name" : "ten3"}];
  // this.applicationList = [{"id": 1, "name" : "app1"},{"id": 2, "name" : "app2"},{"id": 3, "name" : "app3"}];
  this.platformList = [{"id": 1, "name" : "Android"},{"id": 2, "name" : "IOS"}];
  // this.notificationList = [{"id": 1, "name" : "notification1"},{"id": 2, "name" : "notification2"},{"id": 3, "name" : "notification3"}];

  this.dropdownSettings={
    // idField: 'id',
    // textField: 'name',
    countList: 'count_list',
    selectAllText: 'All',
    unSelectAllText: 'All',
    itemsShowLimit: 0,
    allowSearchFilter: false
  };

        this.tenantDropdownSettings = {
          idField: 'id',
          textField: 'name',
          countList: 'count_list',
          selectAllText: 'All tenants',
          unSelectAllText: 'All tenants',
          itemsShowLimit: 0,
          allowSearchFilter: false
      };
      this.appDropdownSettings = {
        idField: 'id',
        textField: 'name',
        countList: 'count_list',
        selectAllText: 'All applications',
        unSelectAllText: 'All applications',
        itemsShowLimit: 0,
        allowSearchFilter: false
    };
    this.platformDropdownSettings = {
      idField: 'id',
      textField: 'name',
      countList: 'count_list',
      selectAllText: 'All platforms',
      unSelectAllText: 'All platforms',
      itemsShowLimit: 0,
      allowSearchFilter: false
  };
 
this.notificationDropdownSettings = {
  idField: 'id',
  textField: 'title',
  countList: 'count_list',
  selectAllText: 'All notifications',
  unSelectAllText: 'All notifications',
  itemsShowLimit: 0,
  allowSearchFilter: false,
  singleSelection:false
};

      //check for active devices
     // this.changesToDTO();
  }
  loadTenants() {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
    this.tenantList = [];
      this.tenantList = res.data.items;
    });
  }
  changesToDTO()
  {
   this.activeDeviceList.forEach(element => {
    element.selectedAndroidVersions=element.androidVersions;
    element.selectedIOSVersions=element.iOSVersions;
    element.filteredAndroidDeviceCount=element.androidDeviceCount;
    element.filteredAndroidDeviceCount=element.iOSDeviceCount;
   });
   console.log("activeDeviceList::"+this.activeDeviceList);
  }

  tabClick(role: string) {
    this.resetFilters();
    this.selectedFilter = role;
    let filterDiv = document.getElementById('filters');

    Object.keys(filterDiv.childNodes).forEach(element => {
      if (filterDiv.childNodes[element].getAttribute("name") == role) {
        filterDiv.childNodes[element].classList.remove("lable-edit-tenat-head-inactive");
        filterDiv.childNodes[element].classList.add("lable-edit-tenat-head-active");
      }
      else {
        filterDiv.childNodes[element].classList.remove("lable-edit-tenat-head-active");
        filterDiv.childNodes[element].classList.add("lable-edit-tenat-head-inactive");
      }
    });

  }
  downloadReport() {

  }
  getColor(index: number)
  {
    return this.colors[index];
    console.log(index);
  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  //footer
  textboxpagechange(pageNumber: any) {
    this.onFooterPage(pageNumber);
  }

  onFooterPage(value: any) {

    let currentPageNumber = 1;
    if (value != "" && value.page == undefined)
      currentPageNumber = value;
    else if (value != "")
      currentPageNumber = value.page;

    // this.applicationService.getApplicationListByPageNumber(currentPageNumber).subscribe((res: any) => {

    //   this.applicationListView = res.data.items;
    //   this.applicationListViewTemp = res.data.items;
    //   this.totalCount = res.data.totalCount;
    //   this.itemsCount = res.data.itemsCount;

    //   this.pageSize = 10;
    //   this.pageNumber = currentPageNumber;

    //   if (this.pageNumber != 1) {
    //     this.startPageNumber = ((this.pageNumber - 1) * this.pageSize) + 1;
    //     this.endPageNumber = ((this.pageNumber - 1) * this.pageSize) + this.pageSize;

    //   }
    //   else {
    //     this.startPageNumber = this.pageNumber;
    //     this.endPageNumber = this.pageSize;
    //   }
    // });
  }

  onFooterPageSizeChange(pageSize: any) {

    //grid footer fixed height
    // let tblBody = document.getElementsByClassName('datatable-body') as HTMLCollectionOf<HTMLElement>;

    // if (tblBody.length != 0) {
    //   let height = (66 * pageSize);
    //   tblBody[0].style.height = height.toString() + "px";
    // }

    // this.applicationService.getApplicationListByPageSize(pageSize).subscribe((res: any) => {

    //   this.applicationListView = res.data.items;
    //   this.applicationListViewTemp = res.data.items;
    //   this.totalCount = res.data.totalCount;
    //   this.itemsCount = res.data.itemsCount;

    //   this.pageSize = pageSize;
    //   this.pageNumber = 1;

    //   if (this.pageNumber != 1) {
    //     this.startPageNumber = ((this.pageNumber - 1) * this.pageSize) + 1;
    //     this.endPageNumber = ((this.pageNumber - 1) * this.pageSize) + this.pageSize;
    //   }
    //   else {
    //     this.startPageNumber = this.pageNumber;
    //     this.endPageNumber = this.pageSize;
    //   }
    // });
  }



public formControlValues(category: string) {
  if(category=='tenant')
  this.chkDiscard = true;
  else if (category=='app')
  this.chkDiscardApp = true;
}

onSelect(item: any, category: string) {
  console.log(this.selectedTenantsList);
  console.log(this.selectedAppsList);
  if(category=='tenant')
  this.loadApps(this.selectedTenantsList);
  else if(category=='app')
  this.loadNotifications(this.selectedAppsList);
}
onDeSelectAll(items: any, category: string) {
  if(category=='tenant')
  this.selectedTenantsList = items;
  else if (category=='app')
  this.selectedAppsList = items;
  else if(category=='platform')
  this.selectedPlatformList=items;
  else if(category=='notification')
  this.selectedNotificationList=items;
  console.log(this.selectedTenantsList);
  console.log(this.selectedAppsList);
}
onDeSelect(items: any, category: string) {
  console.log(this.selectedTenantsList);
  console.log(this.selectedAppsList);
  if(category=='tenant')
  this.loadApps(this.selectedTenantsList);
  else if(category=='app')
  this.loadNotifications(this.selectedAppsList);
}
onSelectAll(items: any, category: string) {
  if(category=='tenant')
  this.selectedTenantsList = items;
  else if (category=='app')
  this.selectedAppsList = items;
  else if(category=='platform')
  this.selectedPlatformList=items;
  else if(category=='notification')
  console.log(this.selectedTenantsList);
  console.log(this.selectedAppsList);
  if(category=='tenant')
  this.loadApps(this.selectedTenantsList);
  else if(category=='app')
  this.loadNotifications(this.selectedAppsList);
}
onSelectVersion(items, row:any, platform:number)
{
  debugger;
  this.isInitialLoad=false;
  if(platform==0)
  this.refreshAndroidDoughNutChart(row);
  else
  this.refreshIOSDoughNutChart(row);
}
refreshAndroidDoughNutChart(row)
{
  row.androidDeviceCount=[];
  let filteredActiveDeviceRow=this.activeDeviceListTemp.filter(item=>item.applicationName==row.applicationName);
  if(filteredActiveDeviceRow && filteredActiveDeviceRow.length>0){

    if(!row.selectedAndroidVersions || row.selectedAndroidVersions.length==0){
    row.androidDeviceCount=filteredActiveDeviceRow[0].androidDeviceCount;
    row.androidVersions=filteredActiveDeviceRow[0].androidVersions;
    }
else{
  row.selectedAndroidVersions.forEach(element => {
    let index = filteredActiveDeviceRow[0].androidVersions.indexOf(element);
     if(index!=-1)
  {
    let androidDeviceCountTemp=[];
    androidDeviceCountTemp=filteredActiveDeviceRow[0].androidDeviceCount;

    row.androidDeviceCount.push(androidDeviceCountTemp[index]);
  }
  });
}
}
}
refreshIOSDoughNutChart(row)
{
  row.iOSDeviceCount=[];
  let filteredActiveDeviceRow=this.activeDeviceListTemp.filter(item=>item.applicationName==row.applicationName);
  if(filteredActiveDeviceRow && filteredActiveDeviceRow.length>0){

    if(!row.selectedIOSVersions || row.selectedIOSVersions.length==0){
    row.iOSDeviceCount=filteredActiveDeviceRow[0].iOSDeviceCount;
    row.iOSVersions=filteredActiveDeviceRow[0].iOSVersions;
    }
else{
  row.selectedIOSVersions.forEach(element => {
    let index = filteredActiveDeviceRow[0].iOSVersions.indexOf(element);
     if(index!=-1)
  {
    let iOSDeviceCountTemp=[];
    iOSDeviceCountTemp=filteredActiveDeviceRow[0].iOSDeviceCount;

    row.iOSDeviceCount.push(iOSDeviceCountTemp[index]);
  }
  });
}
}
}
filteredLabels(row)
{
  if(row.selectedAndroidVersions)
  return row.selectedAndroidVersions;
  else
  return row.androidVersions;
}
onDeSelectAllVersions(items, row:any, platform:number) {
  this.isInitialLoad=false;

  if(platform==0)
  row.selectedAndroidVersions = items;
  else if(platform==1)
  row.selectedIOSVersions = items;
}
onDeSelectVersion(items, row:any, platform:number)
{
this.isInitialLoad=false;
if(platform==0)
  this.refreshAndroidDoughNutChart(row);
  else
  this.refreshIOSDoughNutChart(row);
}
onSelectAllVersions(items, row:any, platform:number) {
  this.isInitialLoad=false;
  if(platform==0)
  row.selectedAndroidVersions = items;
  else if(platform==1)
  row.selectedIOSVersions = items;
}
loadApps(selectedTenantList: any[])
{
// let selectedTenantIds=[];
// selectedTenantList.forEach(element => {
//   selectedTenantIds.push(element.id);
// });
this.appService.getApplicationListByPageSize(selectedTenantList.map(item=>item.id).join(","),null).subscribe((result:any)=>{
  this.applicationList=result.data.items;
});
}
loadNotifications(selectedApps:any[])
{
  this.notificationList=[{id:1,title:"notification1"},{id:2,title:"notification2"},{id:3,title:"notification3"}]
  this.notificationService.getNotificationsList(null,selectedApps.map(item=>item.id).join(",") , false).subscribe((res:any)=>{
    this.notificationList=res.data.items;
  });
}

filterDevices(activeDeviceList: any[], versionList: any[])
{
  console.log(versionList);
  console.log(activeDeviceList);
  return activeDeviceList;
}

filterData()
{
  this.loader.show();
  let tenantIds=[];
  if(this.selectedTenantsList && this.selectedTenantsList.length>0)
  tenantIds=this.selectedTenantsList.map(item=>item.id);

  let appIds=[];
  if(this.selectedAppsList && this.selectedAppsList.length>0)
  appIds=this.selectedAppsList.map(item=>item.id);

  let platformIds=[];
  if(this.selectedPlatformList && this.selectedPlatformList.length>0)
  platformIds=this.selectedPlatformList.map(item=>item.id);

  let notificationIds=[];
  if(this.selectedNotificationList && this.selectedNotificationList.length>0)
  notificationIds=this.selectedNotificationList.map(item=>item.id);
  
  
  if(this.selectedFilter=="activeDevices")
  {
  this.filteredPayload={"appentryIds":appIds,"tenantIds":tenantIds,"platforms":platformIds,"startDate":"","endDate":""}    
    this.reportService.getactiveDevicesReport(this.filteredPayload).subscribe((response:any)=>{
      this.loader.hide();
      this.activeDeviceList=response.data.items;
      this.activeDeviceListTemp=JSON.parse(JSON.stringify(response.data.items));
    });
    //remove later
    this.loader.hide();
    if(!this.activeDeviceList){
    this.activeDeviceList = [{"applicationName": "myapp2",
    "androidVersions":["1.0","2.0"],
    // "iOSVersions":["1.0","2.0"],
    "androidDeviceCount":[200,300],
    "androidTotalDeviceCount":500,
    // "iOSDeviceCount":[400,600],
    "iOSTotalDeviceCount":1000,
    "totalDeviceCount": 1500
    },
    {
        "applicationName": "myapp1",
        "androidVersions":["1.0","2.0"],
        "iOSVersions":["1.0","2.0"],
        "androidDeviceCount":[200,300],
        "androidTotalDeviceCount":500,
        "iOSDeviceCount":[400,600],
        "iOSTotalDeviceCount":1000,
        "totalDeviceCount": 1500
        }];
        this.activeDeviceListTemp=JSON.parse(JSON.stringify(this.activeDeviceList));
      }
  }
  else if(this.selectedFilter=="topTopics")
  {
    this.filteredPayload={"appentryIds":appIds,"tenantIds":tenantIds,"platforms":platformIds,"startDate":"","endDate":""}    
    this.reportService.getTotalTopicsReport(this.filteredPayload).subscribe((result:any)=>{
      this.loader.hide();
      this.topicList=result.data.items;
    });
    //remove later
    // this.topicList=[{
    //   "applicationName":"app1",
    //   "applicationTopics":["topic1","topic2","topic3"],
    //   "applicationTotalTopicCount":100,
    //   "applicationTopicsCount":[100,200,300]
    // }]
    // this.loader.hide();
  }
  else if(this.selectedFilter=="notificationDelivery")
  {
    //this.filteredPayload={"appentryIds":appIds,"tenantIds":tenantIds,"platforms":platformIds,"startDate":"","endDate":""}    
    this.reportService.getTotalNotificationsReport(this.selectedNotificationId,this.selectedDay).subscribe((result:any)=>{
      this.loader.hide();
      this.notificationStatus=result.data;
    });
    //remove later
    // this.loader.hide();
    // this.notificationStatus={
    //   "title":"notification1",
    //   "totalFailedNotificationsAndroid":10,
    //   "totalFailedNotificationsIOS":20,
    //   "totalFailedNotificationsPercentageAndroid":10,
    //   "totalFailedNotificationsPercentageIOS":20,
    //   "totalSuccessfulNotificationsAndroid":40,
    //   "totalSuccessfulNotificationsIOS":30,
    //   "totalSuccessfulNotificationsPercentageAndroid":90,
    //   "totalSuccessfulNotificationsPercentageIOS":80,
    //   "totalSentNotifications":70,
    //   "totalReceivedNotifications":30,
    //    "totalSentNotificationsPercentage":70,
    //    "totalReceivedNotificationsPercentage":30
    // };
    
  }
}

resetFilters()
{
  this.selectedAppsList=[];
  this.selectedTenantsList=[];
  this.selectedPlatformList=[];
  this.selectedNotificationList=[];
  this.selectedDay=null;
}
}
