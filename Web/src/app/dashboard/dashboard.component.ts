import { Component, OnInit } from '@angular/core';
import { ChartType, PointStyle, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import * as Chart from 'chart.js';
import { TenantService } from '../Tenant/tenant.service';
import {DashboardService} from '../dashboard/dashboard.service'
import { TenantListItem } from '../Tenant/_models/tenantList';
import { ApplicationService } from '../Application/application.service';
import { Roles, User } from '../Users/_models/user';
import { NotificationStatus } from './_models/dashboard';
import {DeviceStatus} from './_models/dashboard';
import {UserStatus} from './_models/dashboard';
import {ReportRequestBody} from './_models/dashboard'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public doughnutDeviceChartData: MultiDataSet = [
    [350, 450]
  ];
  public doughnutUserChartData: MultiDataSet = [
    [350, 450]
  ];
  public doughnutDeviceChartLabels: Label[] = ['Total Android devices - ' + this.doughnutDeviceChartData[0][0], 'Total iOs devices - ' + this.doughnutDeviceChartData[0][1]];
  public doughnutUserChartLabels: Label[] = ['Total Android devices - ' + this.doughnutUserChartData[0][0], 'Total iOs devices - ' + this.doughnutUserChartData[0][1]];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#86BC25', '#0076A8'],
      hoverBackgroundColor: ['#86BC25', '#0076A8'],
      hoverBorderColor: ['#86BC25', '#0076A8'],
      cutoutPercentage: 4000

    }
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public pointStyle: PointStyle = 'rectRounded';
  public chartOptions: ChartOptions = {
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
  totalDevices: any;
  tenantList: Array<TenantListItem> = new Array<TenantListItem>();
  dropdownSettings: {};
  selectedTenantsList: Array<any> = [];
  selectedAppsList: Array<any> = [];
  selectedPlatformList: Array<any> = []; 
  selectedNotificationList: Array<any> = [];
  applicationList: any[];
  notificationlicationList: any[];
  roles=Roles;
  showNotificationDashboard:boolean=false;
  dtStartDate:Date=new Date;
  dtEndDate:Date=new Date;
  public notificationStatus: NotificationStatus=new NotificationStatus;
  public userStatus:UserStatus=new UserStatus;
  public deviceStatus:DeviceStatus=new DeviceStatus;
  public reportRequestBody:ReportRequestBody=new ReportRequestBody;


  constructor(private tenantService: TenantService, private appService: ApplicationService,private dashboardService: DashboardService) {
    this.totalDevices = 800;
    this.LoadTenantList();
  }

  ngOnInit() {

    this.dropdownSettings = {
      idField: 'id',
      textField: 'name',
      countList: 'count_list',
      selectAllText: 'All Tenants',
      unSelectAllText: 'All Tenants',
      itemsShowLimit: 0,
      allowSearchFilter: false
  }
  
  }
  onSelect(item: any, category: string) {
    if(category=='tenant'){
    this.LoadApplications(this.selectedTenantsList.map(x=>x.id).join(","));
    
    }
    else if (category=='app'){
    //this.selectedAppsList = item;
    this.onSelectApplication();
    }
  }
  onSelectAll(items: any, category: string) {
    if(category=='tenant'){
    this.selectedTenantsList = items;
    this.LoadApplications(this.selectedTenantsList.map(x=>x.id).join(","));
    }
    else if (category=='app'){
    this.selectedAppsList = items;
    this.onSelectApplication();
    }
    else if(category=='platform')
    this.selectedPlatformList=items;
    else if(category=='notification')
    console.log(this.selectedTenantsList);
    console.log(this.selectedAppsList);
  }
  onDeSelect(items: any, category: string) {
    if(category=='tenant'){
    if(this.selectedTenantsList.length>0)
    this.LoadApplications(this.selectedTenantsList.map(x=>x.id).join(","));  
    else
    this.applicationList = [];
    }
    else if (category=='app'){
      if(this.selectedAppsList.length>0)
      this.onSelectApplication();
      else
      this.selectedAppsList=[];
    }
  }
  onDeSelectAll(items: any, category: string) {
    if(category=='tenant'){
    this.selectedTenantsList = items;
    this.applicationList = [];
    }
    else if (category=='app'){
    this.selectedAppsList = items;
    this.selectedAppsList=[];
    }
    else if(category=='platform')
    this.selectedPlatformList=items;
    else if(category=='notification')
    this.selectedNotificationList=items;
  }

  


  LoadTenantList() {
    this.tenantService.getTenantList().subscribe((res: any) => {
      this.tenantList = res.data.items;
    });
  }

  LoadApplications(tenantId) {
    this.appService.getApplicationListByTenantId(tenantId).subscribe((appList: any) => {
      this.applicationList = appList.data.items;
    });
  }

  onSelectTenant(value: any) {
     this.LoadApplications(value);
  }

  onSelectApplication() {
    this.reportRequestBody.appentryIds=this.selectedAppsList.map(x=>x.id);
    this.reportRequestBody.startDate= this.dtStartDate
    this.reportRequestBody.endDate=this.dtEndDate;
    this.reportRequestBody.tenantIds=this.selectedTenantsList.map(x=>x.id);


    this.dashboardService.getNotificationDashBoard(this.reportRequestBody).subscribe((NUDInfo: any) => {
      this.notificationStatus = NUDInfo.notifications.value.data;
      this.userStatus=NUDInfo.appUsers.value.data;
      this.deviceStatus=NUDInfo.devices.value.data;
         //this.notificationStatus={"title":"test","totalSuccessfulNotificationsAndroid":0,"totalFailedNotificationsAndroid":0,"totalSuccessfulNotificationsPercentageAndroid":30,"totalFailedNotificationsPercentageAndroid":70,"totalSuccessfulNotificationsIOS":0,"totalFailedNotificationsIOS":0,"totalSuccessfulNotificationsPercentageIOS":25,"totalFailedNotificationsPercentageIOS":75,"totalSuccessfulNotifications":0,"totalFailedNotifications":0,"totalSuccessfulNotificationsPercentage":40,"totalFailedNotificationsPercentage":60,"androidTotalDeviceCount": 2,"iosTotalDeviceCount": 1,"totalDeviceCount": 3,"androidTotalUserCount": 0,"iosTotalUserCount": 0,"totalUserCount": 0};
   this.showNotificationDashboard=true;
   this.doughnutDeviceChartData=[[this.deviceStatus.androidTotalDeviceCount, this.deviceStatus.iosTotalDeviceCount]]
   this.doughnutDeviceChartLabels= ['Total Android devices - ' + this.doughnutDeviceChartData[0][0], 'Total iOs devices - ' + this.doughnutDeviceChartData[0][1]];
   this.doughnutUserChartData= [[this.userStatus.androidTotalUserCount,this.userStatus.iosTotalUserCount]];
   this.doughnutUserChartLabels=['Total Android devices - ' + this.doughnutUserChartData[0][0], 'Total iOs devices - ' + this.doughnutUserChartData[0][1]];

    });




  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

 public onStartDateChange(){

  this.reportRequestBody.appentryIds=this.selectedAppsList.map(x=>x.id);
  this.reportRequestBody.startDate= this.dtStartDate
  this.reportRequestBody.endDate=this.dtEndDate;
  this.reportRequestBody.tenantIds=this.selectedTenantsList.map(x=>x.id);


  this.dashboardService.getNotificationDashBoard(this.reportRequestBody).subscribe((NUDInfo: any) => {
    this.notificationStatus = NUDInfo.notifications.value.data;
    this.userStatus=NUDInfo.appUsers.value.data;
    this.deviceStatus=NUDInfo.devices.value.data;
    this.showNotificationDashboard=true;
   this.doughnutDeviceChartData=[[this.deviceStatus.androidTotalDeviceCount, this.deviceStatus.iosTotalDeviceCount]]
   this.doughnutDeviceChartLabels= ['Total Android devices - ' + this.doughnutDeviceChartData[0][0], 'Total iOs devices - ' + this.doughnutDeviceChartData[0][1]];
   this.doughnutUserChartData= [[this.userStatus.androidTotalUserCount,this.userStatus.iosTotalUserCount]];
   this.doughnutUserChartLabels=['Total Android devices - ' + this.doughnutUserChartData[0][0], 'Total iOs devices - ' + this.doughnutUserChartData[0][1]];

  });
  

 }
 public onEndDateChange(){
  this.reportRequestBody.appentryIds=this.selectedAppsList.map(x=>x.id);
  this.reportRequestBody.startDate= this.dtStartDate
  this.reportRequestBody.endDate=this.dtEndDate;
  this.reportRequestBody.tenantIds=this.selectedTenantsList.map(x=>x.id);


  this.dashboardService.getNotificationDashBoard(this.reportRequestBody).subscribe((NUDInfo: any) => {
    this.notificationStatus = NUDInfo.notifications.value.data;
    this.userStatus=NUDInfo.appUsers.value.data;
    this.deviceStatus=NUDInfo.devices.value.data;
    this.showNotificationDashboard=true;
   this.doughnutDeviceChartData=[[this.deviceStatus.androidTotalDeviceCount, this.deviceStatus.iosTotalDeviceCount]]
   this.doughnutDeviceChartLabels= ['Total Android devices - ' + this.doughnutDeviceChartData[0][0], 'Total iOs devices - ' + this.doughnutDeviceChartData[0][1]];
   this.doughnutUserChartData= [[this.userStatus.androidTotalUserCount,this.userStatus.iosTotalUserCount]];
   this.doughnutUserChartLabels=['Total Android devices - ' + this.doughnutUserChartData[0][0], 'Total iOs devices - ' + this.doughnutUserChartData[0][1]];

  });
  
}
}
