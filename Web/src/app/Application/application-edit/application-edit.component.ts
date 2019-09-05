import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application.service';
import { EditApplicationDTO } from '../_models/editApplication';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { TopicService } from 'src/app/Topics/topic.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-application-edit',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.css',
    '../applications-list/applications-list.component.css']
})
export class ApplicationEditComponent implements OnInit {
  guid: any = null;
  application: EditApplicationDTO = new EditApplicationDTO();
  IsIosActive: boolean = true;
  IsAndroidActive: boolean = false;
  tenantName: string = "";

  selectedImageFiles: any[] = [];
  selectedAudioFile: any[] = [];
  selectedAppImageFile: any = {};
  selectedJsonFile: any[] = [];
  selectedApnsFile: any[] = [];
  isJsonFileUploaded: boolean = true;
  isApnsFileUploaded: boolean = false;
  isCreateDisabled: boolean = false;
  APNSCertificate: string = "";
  topicsList: any=[];
  selectedTopics: any[] = [];
  toggleDropdownOnSearch: boolean = false;
  googleJsonFileName: string="";

  constructor(private route: ActivatedRoute, private applicationService: ApplicationService,
    private router: Router, private fileService: FileUploadService, private loader: LoaderService, private toastrService: ToastrService, private topicService: TopicService) {
    this.route.queryParams.subscribe(params => {
      this.guid = params["appId"];
    });

    if (this.guid != null) {
      this.applicationService.getApplicationById(this.guid).subscribe((res: any) => {
        this.application = res.data;
        this.application.id = res.data.id;
        this.selectedTopics=res.data.topics;
        this.tenantName = res.data.tenant.name;
        if (res.data.applicationImageFilePath)
          this.selectedAppImageFile = res.data.applicationImageFilePath;
        if (res.data.notificationImagesFilePath)
          this.selectedImageFiles = res.data.notificationImagesFilePath;
        if (res.data.notificationSoundsFilePath)
          this.selectedAudioFile = res.data.notificationSoundsFilePath;
        if (res.data.androidConfig.googleServicesJsonFilePath && res.data.androidConfig.googleServicesJsonFilePath != "")
          this.selectedJsonFile = res.data.androidConfig.googleServicesJsonFilePath;
      });
    }
    this.LoadTopics();
  }

  ngOnInit() {
  }


  ngDoCheck() {
    this.validations();
  }
  
  LoadTopics()
  {
    this.topicService.getTopicList(null,"all").subscribe((res: any) => {
      this.topicsList = res.data;
    });
  }

  validations() {

    if (this.application.name.trim() != "") {
      this.isCreateDisabled = false;

      if (this.application.iosConfig && this.application.iosConfig.enabled == true) {
        if (
          this.application.iosConfig.bundleId.trim() != "" &&
          this.application.iosConfig.certificatePassword.trim() != ""
          && this.application.iosConfig.apnsCertificateFileBytes != "") {
          this.isCreateDisabled = false;
        }
        else
          this.isCreateDisabled = true;
      }

      if (!this.isCreateDisabled && this.application.androidConfig && this.application.androidConfig.enabled == true) {
        if (
          this.application.androidConfig.packageName.trim() != "" &&
          this.application.androidConfig.fcmApiKey.trim() != "" ) {
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


  iosactive(tabId: any) {
    this.IsIosActive = true;
    this.IsAndroidActive = false;
  }

  androidactive(tabId: any) {
    this.IsIosActive = false;
    this.IsAndroidActive = true;
  }


  backtoApplicationList() {
    this.router.navigate(["application"]);
  }

  //delete the file
  removeTheFile(selectedfile: any, flag: string, listObj: any[],fileType:any) {
    let filePath="";
    if (flag == 'jsonFile')
    filePath=selectedfile.filePath;
    else
    filePath=selectedfile.value;

    this.fileService.deleteFile(filePath,fileType).subscribe((event: any) => {
      if (event.data && event.data.success) {
        this.application.isMediaChanged=true;
        const index: number = listObj.findIndex(x => x.name === selectedfile.name);
        if (index !== -1) {
          listObj.splice(index, 1);
        }

        if (flag == 'jsonFile') {
          this.isJsonFileUploaded = false;
          this.application.androidConfig.googleServicesJsonFilePath = "";
          this.googleJsonFileName="";
        }
      }
    });
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
    this.application.isIosConfigChanged=true;
    let certBinary = this.readThis($event.target);
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
  upload(files, type, fileType: any) {
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
        this.googleJsonFileName=file.name;
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
    this.fileService.uploadFile(formData, isCertificate, certificateType, this.application.iosConfig.certificatePassword, fileType).subscribe((res: any) => {
      if (res.body) {

        if(type == "googleJson")
        this.application.isAndroidConfigChanged=true;
        else
        this.application.isMediaChanged=true;

        Object.keys(res.body.data).forEach(element => {

          let index = res.body.data[element].fileName.indexOf("_");
          let len = res.body.data[element].fileName.length;

          let uniqueFileName = res.body.data[element].fileName;

          if (index != -1)
            res.body.data[element].fileName = res.body.data[element].fileName.substring(index + 1, len);

          //add file details to respective list to display on UI
          if (type == "NotificationImage")
            this.selectedImageFiles.push({ "key": res.body.data[element].fileName, "value": res.body.data[element].filePath });
          else if (type == "NotificationAudio")
            this.selectedAudioFile.push({ "key": res.body.data[element].fileName, "value": res.body.data[element].filePath });
          else if (type == "AppImage") {
            this.selectedAppImageFile={ "key": res.body.data[element].fileName, "value": res.body.data[element].filePath };

            // this.selectedAppImageFile.push(res.body.data[element]);
            // this.application.applicationImageFilePath = uniqueFileName;
          }
          else if (type == "googleJson") {
            this.isJsonFileUploaded = true;
            this.selectedJsonFile.push(res.body.data[0])
            this.application.androidConfig.googleServicesJsonFilePath = res.body.data[element].filePath;
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

  downloadFile(filePath, fileType) {
    this.fileService.downloadFile(filePath,fileType);
  }

  cancelApnsUpload() {
    this.application.iosConfig.apnsCertificateFileBytes = "";
    this.APNSCertificate = "";
  }

  saveApplication() {

    
    this.application.token=this.application.name.toLowerCase()+".token";

    //add extensions to ios and android tokens
    this.application.iosConfig.appToken=this.application.name.toLowerCase()+".iOS";
    this.application.androidConfig.appToken=this.application.name.toLowerCase()+".Droid";

    // Object.keys(this.application).forEach(key => this.application[key] === undefined ? delete this.application[key] : '');
    // Object.keys(this.application).forEach(key => this.application[key] === null ? delete this.application[key] : '');
    // this.selectedImageFiles.forEach(element => {
    this.application.notificationImagesFilePath = this.selectedImageFiles;
    this.application.notificationSoundsFilePath = this.selectedAudioFile;
    this.application.applicationImageFilePath = this.selectedAppImageFile;
    // }); 
    // this.selectedAudioFile.forEach(element => {
    //   this.application.NotificationSoundsFilePath.push({'key' : element.fileName , 'value' :element.filePath })
    // }); 
    // if(this.selectedAppImageFile.length>0)
    // this.application.ApplicationImageFilePath=this.selectedAppImageFile[0].fileName;

    console.log("selectedTopics"+this.selectedTopics);
    this.application.topics=this.selectedTopics;
//     this.selectedTopics.forEach(element => {
//       this.application.topics.push({id:element.id,topicCategory:element.topicCategory,topicName:element.topicName});
// });
    

    this.applicationService.saveApplication(this.application.id, this.application).subscribe((data) => {
      this.toastrService.show("Application " + this.application.name + " details are successfully updated");
      this.router.navigate(["application"]);
    });
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

}
