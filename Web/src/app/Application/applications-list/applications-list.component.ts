import { Component, OnInit, DoCheck, OnChanges } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TenantService } from 'src/app/Tenant/tenant.service';
import { ApplicationService } from '../application.service';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';
import { ApplicationDTO, AssociatedTopic } from '../_models/createApplication';
import { EditTenant } from 'src/app/Tenant/_models/editTenant';
import { ApplicationListItem } from '../_models/applicationList';
import { NgModel } from '@angular/forms';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { TopicService } from 'src/app/Topics/topic.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TopicListItem } from 'src/app/Topics/_models/Topics';
import { Roles, ApplicationRoleType } from 'src/app/Users/_models/user';
import { FileType } from '../_models/File';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import {HideIfUnauthorizedApp} from 'src/app/shared/directives/hideApp-if-unauthorized.directive'


@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.css']
})

export class ApplicationsListComponent implements OnInit, DoCheck {

  TenantId: any = 0;
  TenantName: any;
  dasableCreateApplication: boolean = true;
  isCreateApplication: boolean = false;
  tenantList: Array<TenantListItem> = new Array<TenantListItem>();
  application: ApplicationDTO = new ApplicationDTO();
  IsIosActive: boolean = true;
  IsAndroidActive: boolean = false;
  editTenantRecord: EditTenant = new EditTenant();
  iosdisable: boolean = true;
  androiddisable: boolean = true;
  applicationListView: Array<ApplicationListItem> =  new Array<ApplicationListItem>();
  applicationListViewTemp: any;
  totalCount: number = 0;
  itemsCount: number = 0;
   showserarchImage: boolean = false;
  public query: NgModel;
  searchTenantNameText: number = 0;
  selectedImageFiles: any[] = [];
  selectedAudioFile: any[] = [];
  selectedAppImageFile: any={fileName: "", filePath: ""};
  selectedJsonFile: any[] = [];
  selectedApnsFile: any[] = [];
  currentUserRole: any[] = [];

  appNameDsc: boolean = false;
  createdDateDsc: boolean = false;
  sortByAppName: boolean = false;
  sortByDate: boolean = false;
  hideSortByAppName: boolean = true;
  isJsonFileUploaded: boolean = true;
  isApnsFileUploaded: boolean = false;
  isCreateDisabled: boolean = true;
  disabledFields: boolean = false;
  actionType: string = "";
  ApplicationIdDelete: any = "";
  modalDeleteApplicatoin: boolean = false;
  ApplicationName: string = "";
  APNSCertificate: string = "";
  topicsList: AssociatedTopic[]=[];
  selectedTopics: AssociatedTopic[] = [];
  toggleDropdownOnSearch: boolean = false;
  owners: any[]=[];
  readers: any[]=[];
  notificationOwners: any[]=[];
  manageTenant: boolean = false;
  isApplication: boolean = false;
  selectedApp: any;
  roles=Roles;
  applicationRoles=ApplicationRoleType;
  isSystemUser: boolean=false;
  selectedTenantId:any;

  fieldName:string="CreatedDate";
 isAscendingSort:any=false;
 pageSize: number = 10;
  pageNumber: number = 1;
  startPageNumber: number = 0;
  endPageNumber: number = 0;
  keyWord:string="";
  constructor(private router: Router, private tenantService: TenantService, private applicationService: ApplicationService, private fileService: FileUploadService, private loader: LoaderService, private toastrService: ToastrService, private topicService: TopicService, private authService: AuthenticationService) {
    this.application.status = true;
    this.application.iosConfig.enabled = true;
    this.application.androidConfig.enabled = true;
    this.LoadTenantList();
    
    // this.LoadApplications();
    this.LoadTopics();
    this.isApplication = true;

    //remove later
    this.owners = [{userName: "ten ten", imageUrl: "assets/images/Mask.png"},
    {userName: "eleven eleven", imageUrl: "assets/images/Mask.png"},
    {userName: "twelve twelve", imageUrl: "assets/images/Mask.png"}];
    this.readers =  [{userName: "one one", imageUrl: "assets/images/Mask.png"},
    {userName: "two two", imageUrl: "assets/images/Mask.png"},
    {userName: "three three", imageUrl: "assets/images/Mask.png"}];
    this.notificationOwners= [{userName: "four four", imageUrl: "assets/images/Mask.png"},
    {userName: "five five", imageUrl: "assets/images/Mask.png"},
    {userName: "six six", imageUrl: "assets/images/Mask.png"}];
  }

  ngOnInit() {
  }
 
  LoadTopics()
  {
    this.topicService.getTopicList(null,"all").subscribe((res: any) => {
    this.topicsList=[];
      // res.data.forEach(element => {
      //   this.topicsList.push({"id":element.id,"topicType":element.topicType,"topicName":element.topicName});
      // });
       this.topicsList = res.data.items;
    });
   
  }

  ngDoCheck() {
    this.validations();
  }

  validations() {

    if ((this.application.name &&  this.application.name != "")) {
      this.isCreateDisabled = false;

      if (this.application.iosConfig.enabled == true) {
        if (this.application.iosConfig.bundleId != "" 
        &&
          this.application.iosConfig.certificatePassword != ""
          && this.application.iosConfig.apnsCertificateFileBytes != ""
          ) {
          this.isCreateDisabled = false;
        }
        else
          this.isCreateDisabled = true;
      }

      if (!this.isCreateDisabled && this.application.androidConfig.enabled == true) {
        
        if (
          this.application.androidConfig.packageName != "" &&
          this.application.androidConfig.fcmApiKey != "") {
          this.isCreateDisabled = false;
        }
        else
          this.isCreateDisabled = true;
      }

    }
    else {
      this.isCreateDisabled = true;
    }
  }

  LoadTenantList() {
    this.tenantService.getTenantListByPageSize(null).subscribe((res: any) => {
    this.tenantList = [];
      this.tenantList = res.data.items;
      this.authService.userRole.subscribe((data) => {
       if(data.indexOf(Roles.SystemAdmin) === -1 && data.indexOf(Roles.SystemReader) === -1){
        this.isSystemUser=false;
        if(res.data && res.data.items && res.data.items.length>0)
        this.selectedTenantId=res.data.items[0].id;
        this.onChange(null,res.data.items[0].id,res.data.items[0].name);
       }
       else{
        this.isSystemUser=true;
        this.selectedTenantId="all";
        this.LoadApplications(this.selectedTenantId);
       }
      });
      
    });
    this.checkTenantOwner(this.selectedTenantId);
  }

  LoadApplications(selectedTenantId) {
    this.loader.show();
    this.selectedTenantId=selectedTenantId;
    this.pageSize = 10;
    this.pageNumber = 1
    this.applicationService.getAllApplicationList(this.selectedTenantId,this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.loader.hide();
      this.applicationListView=[];
      this.applicationListViewTemp=[];
      this.applicationListView = res.data.items;
      this.applicationListViewTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;      
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

  onChange(args: any, selectedTenantId: any, selectedTenantName: any) {
    this.applicationListView=null;
    if(!selectedTenantId)
    this.TenantId = args.target.value;
    else
    this.TenantId=selectedTenantId;
    this.selectedTenantId=this.TenantId;
    this.application.tenant=new TenantListItem();
    if(!selectedTenantName)
    this.TenantName = args.target.options[args.target.selectedIndex].text;
    else
    this.TenantName=selectedTenantName;
    this.tenantService.getTenantById(this.TenantId).subscribe((res: any) => {
      if(res.data && res.data.length>0)
      this.application.tenant = res.data[0];
    

     

      //check if the tenant has available space
      if(this.application.tenant.spaceAvailable>0){
        this.dasableCreateApplication = false;
        this.checkTenantOwner(this.TenantId);
        }
        else if(this.application.tenant.spaceAvailable<=0){
        this.dasableCreateApplication = true;
        alert("To create application, please allocate space to the selected tenant and try again.");
        }
    });

    if (this.TenantId == "all") {
      this.dasableCreateApplication = true;
      this.LoadApplications(this.TenantId);
    }
    else {
      this.LoadApplications(this.TenantId);
      
    }
  }
checkTenantOwner(tenantId: any){
  let userProfile;
  let currentUserRole;
  
  this.authService.userRole.subscribe((data) => {
    currentUserRole = data;
    if(currentUserRole.indexOf(Roles.SystemAdmin)==-1){
      let allTenantIds=localStorage.getItem("allTenantIds");
      if(allTenantIds.indexOf(tenantId)==-1){
        this.dasableCreateApplication = true;
        return false;
      }
      else{
        this.authService.userProfile.subscribe((data) => {
          userProfile=data;
          for(let objTenant of userProfile.tenantRoles){
            if(tenantId==objTenant.tenant.id){
              if(objTenant.tenantRoleType==0){
                this.dasableCreateApplication = false;
              return true;
              }
              else{
                this.dasableCreateApplication = true;
              return false;
              }
            }
          }
      });
      }
    
    }
    else{
      return true;
    }

  });
  

}
  applicationsByTenantId(tenantId: any) {
    this.loader.show();
    this.applicationService.getApplicationListByPageNumber(tenantId,null).subscribe((res: any) => {
    this.applicationListView=[];
      if(res.data && res.data.length>0){
      this.applicationListView = res.data;
      this.applicationListViewTemp = res.data;
      }
      else
      this.applicationListView=null;
      this.loader.hide();
    });
  }

  iosEnable(e) {
    if (e.target.checked) {
      this.iosdisable = false;
      this.application.iosConfig.enabled = true;
    }
    else {
      this.iosdisable = true;
      this.application.iosConfig.enabled = false;
    }

    this.application.iosConfig.appToken = "";
    this.application.iosConfig.bundleId = "";
    this.application.iosConfig.certificateThumbPrint = "";
    this.application.iosConfig.certificatePassword = "";
    this.application.iosConfig.apnsCertificateFileBytes = "";

    this.validations();
  }

  androidEnable(e) {

    if (e.target.checked) {
      this.androiddisable = false;
      this.application.androidConfig.enabled = true;
      this.isJsonFileUploaded = false;
    }
    else {
      this.isJsonFileUploaded = true;
      this.androiddisable = true;
      this.application.androidConfig.enabled = false;
    }

    this.application.androidConfig.appToken = "";
    this.application.androidConfig.packageName = "";
    this.application.androidConfig.fcmApiKey = "";

    this.validations();
  }

  gotoapplication() {
    if (this.TenantId != "all") {
      this.application.status = true;
      this.isCreateApplication = true;
      this.application.name = "";
      this.application.token = "";
      this.applicationService.tenantIDs=this.TenantId;
      this.formReset();
      this.isCreateDisabled=false;
    }
  }

  formReset() {
    this.application.notificationImagesFilePath = [];
    this.application.notificationSoundsFilePath = [];
    this.application.applicationImageFilePath = [];
    this.selectedImageFiles = [];
    this.selectedAudioFile = [];
    this.selectedAppImageFile = {};

    //this.application.iOSConfig.Enabled = true;
    this.application.iosConfig.appToken = "";
    this.application.iosConfig.bundleId = "";
    this.application.iosConfig.certificateThumbPrint = "";
    this.application.iosConfig.certificatePassword = "";
    this.application.iosConfig.apnsCertificateFileBytes = "";

    //this.application.AndroidConfig.Enabled = true;
    this.application.androidConfig.appToken = "";
    this.application.androidConfig.packageName = "";
    this.application.androidConfig.fcmApiKey = "";
  }

  backtoApplicationView() {
    this.isCreateApplication = false;
    //this.TenantId = 0;
    this.dasableCreateApplication = false;
  }

  createApplication() {
   
    if(this.application.tenant.spaceAvailable<=0)
    {
      alert("Please allocate space to the seleccted tenant and try again.");
      return false;
    }
   
    this.application.token=this.application.name.toLowerCase() + ".token";

    //add extensions to ios and android tokens
    this.application.iosConfig.appToken=this.application.name.toLowerCase()+".iOS";
    this.application.androidConfig.appToken=this.application.name.toLowerCase()+".Droid";

    Object.keys(this.application).forEach(key => this.application[key] === undefined ? delete this.application[key] : '');
    Object.keys(this.application).forEach(key => this.application[key] === null ? delete this.application[key] : '');

    this.selectedImageFiles.forEach(element => {
      this.application.notificationImagesFilePath.push({ 'key': element.fileName, 'value': element.filePath })
    });
    this.selectedAudioFile.forEach(element => {
      this.application.notificationSoundsFilePath.push({ 'key': element.fileName, 'value': element.filePath })
    });
    this.application.applicationImageFilePath={ 'key': this.selectedAppImageFile.fileName, 'value': this.selectedAppImageFile.filePath };


    console.log("selectedTopics"+this.selectedTopics);
    this.application.topics=this.selectedTopics;
//     this.selectedTopics.forEach(element => {
//       this.application.topics.push({topicId:element.id,topicCategory:element.topicCategory,topicName:element.topicName});
// });
     // this.application.topics=this.selectedTopics;
    

    // if(this.selectedAppImageFile.length>0)
    // this.application.applicationImageFilePath=this.selectedAppImageFile[0].fileName;

    this.applicationService.createApplication(this.application).subscribe((data) => {
      
      this.toastrService.show("Application " + this.application.name + " is successfully created");
      this.isCreateApplication = false;
      this.dasableCreateApplication = true;
      this.LoadApplications(null);
      this.LoadTenantList();
      this.application = new ApplicationDTO();
    });
  }

  cancel() {
    this.application.iosConfig.enabled = false;
    this.application.androidConfig.enabled = false;
    this.formReset();
  }
  appStatus(e) {
    if (!(e.target.checked)) {
      this.disabledFields = true;
      this.application.iosConfig.enabled = false;
      this.application.androidConfig.enabled = false;
      this.iosdisable = true;
      this.androiddisable = true;
    }
    else {
      this.disabledFields = false;
    }
    this.formReset();
  }

  iosactive(tabId: any) {
    this.IsIosActive = true;
    this.IsAndroidActive = false;
  }

  androidactive(tabId: any) {
    this.IsIosActive = false;
    this.IsAndroidActive = true;
  }

  apnsCertificate(event: any) {
    // alert(event);
  }


  onActivate(value: any) {
    if (value.type == 'click') {
      let navigation: NavigationExtras = {
        queryParams: {
          "appId": value.row.id
        }
      }

      if (this.actionType == "Edit") {
        this.router.navigate(["application/edit"], navigation);
        return;
      }
      if (this.actionType == "Delete") {
        this.modalDeleteApplicatoin = true
        return;
      }
      else
        this.router.navigate(["application/viewapplication"], navigation);
    }
  }

  editTenant(value: any) {
    this.actionType = "Edit";
  }

  updateFilter(event) {
    //alert('filter');
    this.keyWord = event.target.value;
    // commented for getting the filter from API

    // // filter our data
    // const temp = this.applicationListViewTemp.filter(function (d) {
    //   return d.name.indexOf(val) !== -1 || !val;
    // });

    // // update the rows
    // this.applicationListView = temp;
    // // Whenever the filter changes, always go back to the first page
    this.applicationListView=[];
    this.applicationService.getAllApplicationList(this.selectedTenantId, this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      if(res.data.items!=null){
      
      this.applicationListView = res.data.items;
      this.applicationListViewTemp = res.data.items;
      this.totalCount = res.data.totalCount;
      this.itemsCount = res.data.itemsCount;      
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
    }
    });
  }

  focus() {
    this.showserarchImage = true;
    this.hideSortByAppName = false;
  }

  focusout() {
    this.showserarchImage = false;
    this.hideSortByAppName = true;
  }

  gridSort(fieldName: any, sortDirection: any) {
    if (fieldName == "ApplicationName") {
      this.sortByDate = false;
      this.sortByAppName = true;
      this.createdDateDsc = false;
      this.appNameDsc = (this.appNameDsc == true ? false : true);
    }
    else if (fieldName == "CreatedDate") {
      this.sortByAppName = false;
      this.sortByDate = true;
      this.appNameDsc = false;
      this.createdDateDsc = (this.createdDateDsc == true ? false : true);
    }
   
    if(sortDirection=="Descending")
    this.isAscendingSort=false;
    else
    this.isAscendingSort=true;

    this.applicationService.getAllApplicationList(this.selectedTenantId, this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.applicationListView=null;
      this.applicationListView = res.data.items;
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

    this.applicationService.getAllApplicationList(this.selectedTenantId, this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      this.applicationListView=null;
      this.applicationListView = res.data.items;
      this.applicationListViewTemp = res.data.items;
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

    this.applicationService.getAllApplicationList(this.selectedTenantId, this.pageNumber,this.fieldName,this.isAscendingSort,this.pageSize,this.keyWord).subscribe((res: any) => {
      if( res.data.items!=null){
      this.applicationListView=null;
      this.applicationListView = res.data.items;
      this.applicationListViewTemp = res.data.items;
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

  //delete the file
  removeTheFile(selectedfile: any, flag: string, listObj: any[], fileType: any) {
    this.fileService.deleteFile(selectedfile.filePath,fileType).subscribe((event: any) => {
      if (event.data && event.data.success) {
        if(flag=="appImage")
        {
         this.selectedAppImageFile={fileName:"",filePath:""};
        }
        else{
        const index: number = listObj.findIndex(x => x.fileName == selectedfile.fileName);
        if (index !== -1) {
          listObj.splice(index, 1);
        }
      }

        if (flag == 'jsonFile') {
          this.isJsonFileUploaded = false;
          this.application.androidConfig.googleServicesJsonFilePath = "";
        }
      }
    });
  }
  cancelApnsUpload() {
    this.application.iosConfig.apnsCertificateFileBytes = "";
    this.APNSCertificate = "";
  }
  uplaodApnsCert($event): void {

    var notMatced = false;
    if ($event.target.files.length > 1) {
      alert("Please upload only one file");
      return;
    }


    if ($event.target.files[0].type != "application/x-pkcs12" && $event.target.files[0].type != "application/x-x509-ca-cert") {
      alert("Please upload .cer or .p12 file format");
      return;
    }
    this.APNSCertificate = $event.target.files[0].name;
    let certBinary = this.readThis($event.target);

   // this.upload($event.target.files,"apnsCertificate",FileType.APNSCert);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      
      this.application.iosConfig.apnsCertificateFileBytes =
        myReader.result.toString().split("base64,")[1];
    }
    myReader.readAsDataURL(file);
  }

  //upload files
  upload(files, type, fileType:any) {
    if (files.length === 0)
      return;
    this.loader.show();
    const formData = new FormData();

    let listObj;
    let isCertificate: boolean = false;
    let certificateType: string;

    //assign the respective object to listObj
    if (type == "NotificationImage")
      listObj = this.selectedImageFiles;
    else if (type == "NotificationAudio")
      listObj = this.selectedAudioFile;
    else if (type == "AppImage")
      listObj = this.selectedAppImageFile;


    let elemExists: any;
    for (let file of files) {
      formData.append(file.name, file);

      //validations
      if (type == "AppImage") {
        if (file.type != "image/png") {
          alert("Please upload PNG image.");
          this.loader.hide();
          return false;
        }
      }
      else if (type == "NotificationImage") {
        if (file.type != "image/svg+xml") {
          alert("Please upload SVG image.");
          this.loader.hide();
          return false;
        }
      }
      else if (type == "NotificationAudio") {
        if (file.type != "audio/wav") {
          alert("Please upload WAV audio file.");
          this.loader.hide();
          return false;
        }
      }
      else if (type == "googleJson") {
        if (file.type != "application/json") {
          alert("Please upload JSON file.");
          this.loader.hide();
          return false;
        }
        isCertificate = true;
        certificateType = "Droid";
      }
      else if (type == "apnsCertificate") {
        if (file.type != "application/x-pkcs12") {
          alert("Please upload valid APNS certificate.");
          this.loader.hide();
          return false;
        }
        isCertificate = true;
        certificateType = "iOS";
      }


      //if file already exists
      if (type != "AppImage" && listObj) {
        elemExists = listObj.find(e => e.fileName === file.name);
        if (elemExists) {
          const index: number = listObj.findIndex(x => x.fileName === file.name);
          if (index !== -1)
            listObj.splice(index, 1);
        }
      }
    }

    //service call  
    this.fileService.uploadFile(formData, isCertificate, certificateType, this.application.iosConfig.certificatePassword,fileType).subscribe((res: any) => {
      if (res.body) {

        Object.keys(res.body.data).forEach(element => {

          let index = res.body.data[element].fileName.indexOf("_");
          let len = res.body.data[element].fileName.length;

          let uniqueFileName = res.body.data[element].fileName;

          if (index != -1)
            res.body.data[element].fileName = res.body.data[element].fileName.substring(index + 1, len);

          //add file details to respective list to display on UI
          if (type == "NotificationImage")
            this.selectedImageFiles.push(res.body.data[element]);
          else if (type == "NotificationAudio")
            this.selectedAudioFile.push(res.body.data[element]);
          else if (type == "AppImage") {
            this.selectedAppImageFile=res.body.data[element];
            //this.application.applicationImageFilePath = uniqueFileName;
          }
          else if (type == "googleJson") {
            
            this.isJsonFileUploaded = true;
            this.selectedJsonFile = [];
            this.selectedJsonFile.push(res.body.data[0]);
            this.application.androidConfig.googleServicesJsonFilePath = res.body.data[0].filename;
          }
          else if (type == "apnsCertificate") {
            this.isApnsFileUploaded = true;
            this.selectedApnsFile.push(res.body.data[0])
            this.application.iosConfig.apnsCertificateFilePath = res.body.data[0].filename;
            this.application.iosConfig.expiresOn = res.body.data[0].expiryDate;
            this.application.iosConfig.certificateThumbPrint = res.body.data[0].certificateThumbPrint;
          }
        });
        this.loader.hide();
      }
    });
  }


  downloadFile(filePath,fileType) {
    this.fileService.downloadFile(filePath,fileType);
  }

  deleteApplication(guid: any, applicationName: string) {
    this.actionType = "Delete";
    this.ApplicationIdDelete = guid;
    this.ApplicationName = applicationName;
  }

  confirmDeleteApplication() {
    this.actionType = "";
    this.modalDeleteApplicatoin = false;
    this.applicationService.deleteApplication(this.ApplicationIdDelete).subscribe((res: any) => {
      this.toastrService.show("Application is successfully deleted");
      this.LoadApplications(null);
    });
  }

  closeDeletePopup() {
    this.actionType = "";
    this.modalDeleteApplicatoin = false;
  }

  closeDropdown()
  {
    this.toggleDropdownOnSearch = false;
  }

  public onSearch(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = true;
  }

  public onClear(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = false;
  }

  public onItemAdd(value: any, select: NgSelectComponent) {
    
    this.toggleDropdownOnSearch = true;

  }

  editRoles(e:any, selectedApp:any)
  {
     //add overflow hidden to body on modal open
     let body = document.getElementsByTagName('body')[0];
     body.classList.add("overflowFixed");   //add the class

    e.stopPropagation();
    this.applicationService.getApplicationById(selectedApp.id).subscribe((res: any) => {
      this.selectedApp=res.data;
   this.manageTenant=true;
    });
   
  }
  close($event) {
    //remove overflow hidden for body on modal close
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("overflowFixed");   //remove the class
    
    if ($event == "manage") {
      this.manageTenant = !$event;
    }
    this.LoadTenantList();
    this.LoadApplications(null);
  }
  filterUsersBasedOnRole(appUserList:any[],role:number)
  {
    if(appUserList && appUserList.length>0 && role==ApplicationRoleType.applicationOwner)
    return appUserList.filter(item=>item.roleType==ApplicationRoleType.applicationOwner);
    else if(appUserList && appUserList.length>0 && role==ApplicationRoleType.applicationReader)
    return appUserList.filter(item=>item.roleType==ApplicationRoleType.applicationReader);
    else if(appUserList && appUserList.length>0 && role==ApplicationRoleType.applicationNotificationOwner)
    return appUserList.filter(item=>item.roleType==ApplicationRoleType.applicationNotificationOwner);
    else
    return [];
  }
}
