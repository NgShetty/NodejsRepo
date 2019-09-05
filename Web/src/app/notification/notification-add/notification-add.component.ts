import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { NotificationAdd, NotificationEdit } from '../_models/notification-details';
import { ApplicationService } from 'src/app/Application/application.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { NgSelectModule, NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { Timezone, TimezonePickerService } from 'ng2-timezone-selector';
import { getLocaleDateTimeFormat } from '@angular/common';
import * as moment from 'moment-timezone';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js'
import { TopicService } from 'src/app/Topics/topic.service';
import { TopicType } from 'src/app/Topics/_models/Topics';
import { debounceTime, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AssociatedTopic } from 'src/app/Application/_models/createApplication';

const parchment = Quill.import('parchment')
const block = parchment.query('block')
block.tagName = 'DIV'
// or class NewBlock extends Block {} NewBlock.tagName = 'DIV'
Quill.register(block /* or NewBlock */, true)

@Component({
  selector: 'app-notification-add',
  templateUrl: './notification-add.component.html',
  styleUrls: ['./notification-add.component.less']
})
export class NotificationAddComponent implements OnInit {
  @Output() onModalClose = new EventEmitter();
  @Input() notificationObj: NotificationEdit;
  @Input() tenantId: any;
  notificationForm: any;
  editMode: boolean = false;
  modules = {}
  //for multiselect dropdown
  dropdownList = [];
  filteredList = [];
  selectedList: AssociatedTopic[] = [];
  dropdownSettings = {};
  ToggleDropdownOnSearch: boolean = false;
  msgPlaceholder: string = "Add Message";
  messageBodyCharCount:number;
  richTextEditorerrormsgdisplay:boolean;
  date : Date = new Date();
  timezone: any = this.date.getTimezoneOffset();
  test:Timezone[];
  name = 'Angular';
  jun = moment();
  private value: any = ['Athens'];
  isIOS:boolean=false;
  isAndroid:boolean=false;

  exampleData: any = [
    {
      id: 'basic1',
      text: 'Basic 1'
    },
    {
      id: 'basic2',
      disabled: true,
      text: 'Basic 2'
    },
    {
      id: 'basic3',
      text: 'Basic 3'
    },
    {
      id: 'basic4',
      text: 'Basic 4'
    }
  ];
  //models
  applicationList: any[];
  filteredNotificationSounds: any = [];
  filteredNotificationImages: any = [];
  notificationSoundSelected: string;
  notificationImageSelected: string;
  notificationSoundPath: string;
  notificationImagePath: string;
  //notificationObj:NotificationAdd=new NotificationAdd();
  showNotificationImageDropdown: boolean = false;
  showNotificationSoundDropdown: boolean = false;
  public isRecipientsGrpDisable:boolean=true;
  dt: Date = new Date();
  minDateValue: Date;
  minTime: Date = new Date();
  notificationAudioFiles: any;
  notificationImageFiles: any;
  notificationAudioFiles1: any;
  notificationImageFiles1: any;
  requiredCategories: boolean = false;
  public Editor;
  userCategory: boolean = false;
  groupCategory: boolean = false;
  topicCategory: boolean = false;
  versionCategory: boolean = false;
  errorStyle: boolean = false;
  topicType: { [key: number]: string } =
  {
    1: 'Versions',
    2: 'Groups',
    3: 'Topics',
    4: 'Users'
  };
  recipientList:AssociatedTopic[]=[];
  usersinput$ = new Subject<string>();
  filtreredRecipientTypes:any[]=[];
  constructor(private formBuilder: FormBuilder, private notificationService: NotificationService, private appService: ApplicationService, private fileService: FileUploadService, private toastrService: ToastrService, private testService: TimezonePickerService, private topicService: TopicService) {
  console.log(this.timezone);
    this.minDateValue=this.dt;

    // this.LoadApplicationList();

    console.log(this.notificationObj);
    console.log(this.editMode);

    this.modules = {
      'emoji-shortname': true,
      'emoji-toolbar': true,
      'toolbar': { container: [ 'bold','emoji' ] }
    }

  }

  ngOnInit() {

    this.LoadApplicationList(this.tenantId);
    this.loadRecipients();

    //do something for edit notification
    if (this.notificationObj.id) {
      this.isIOS=this.notificationObj.isIOSNotification;
      this.isAndroid=this.notificationObj.isAndroidNotification;
      this.editMode = true;
      this.selectedList=this.notificationObj.topics;
      var date = new Date(this.notificationObj.scheduledTime); 
      this.notificationObj.scheduledTime = date.getTime();
    }
    else {
      //do something for create notificationSoundPath
    }
    // this.dropdownList = [
    //   { item_id: 1, itemName: 'Sindel', Category: "User" },
    //   { item_id: 2, itemName: 'Walsmith', Category: "User" },
    //   { item_id: 3, itemName: 'Ross', Category: "User" },
    //   { item_id: 4, itemName: 'Oliver', Category: "User" },
    //   { item_id: 5, itemName: 'Theo', Category: "User" },
    //   { item_id: 6, itemName: 'Group1', Category: "Group" },
    //   { item_id: 7, itemName: 'Group2', Category: "Group" },
    //   { item_id: 8, itemName: 'Group3', Category: "Group" },
    //   { item_id: 9, itemName: 'Audit & Consulting', Category: "Topic" },
    //   { item_id: 10, itemName: 'Support', Category: "Topic" },
    //   { item_id: 11, itemName: 'Administrative', Category: "Topic" },
    //   { item_id: 12, itemName: 'Support1', Category: "Topic" },
    //   { item_id: 13, itemName: 'Administrative1', Category: "Topic" },
    //   { item_id: 14, itemName: 'Support2', Category: "Topic" },
    //   { item_id: 15, itemName: 'Administrative2', Category: "Topic" }
    // ];

    this.dropdownSettings = {
      text: "Search User",
      classes: "myclass custom-class",
      primaryKey: "item_id",
      enableSearchFilter: true,
      badgeShowLimit: 10,
      groupBy: 'topicType',
      showCheckbox: false
    };

    //form validations

    this.notificationForm = new FormGroup({
      application: new FormControl(null, [Validators.required]),
      richTextEditor: new FormControl(null, [Validators.required]),
      scheduleNotification: new FormControl(null),
      datePickerInput: new FormControl(null),
      timePickerInput: new FormControl(null),
      title: new FormControl(null, [Validators.maxLength(50)]),
      notificationSound: new FormControl(),
      notificationImage: new FormControl(),
      
      recipientsGrp: new FormGroup({
        recipients: new FormControl(null, [Validators.required]),
        categories: new FormControl(null),
        userCategory: new FormControl(null),
        groupCategory: new FormControl(null),
        topicCategory: new FormControl(null),
        versionCategory: new FormControl(null)
      }),
      platformCheckboxGroup: new FormGroup({
        platformIOS: new FormControl(),
        platformAndroid: new FormControl()
      }, requireCheckboxesToBeCheckedValidator()),
    });
  }

  private loadRecipients() {
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
      debounceTime(500),
      filter(value => value.length >= 3),
      distinctUntilChanged(),
      switchMap(searchTerm => this.topicService.searchTopics(searchTerm,this.tenantId,this.notificationObj.application.id,this.filtreredRecipientTypes)),
    ).subscribe((response:any) => {
      this.recipientList = response.data;  
  });
//  this.recipientList=[
//{"topicName":"Minoosha Chinni","topicType":4,"topicValue":"mchinni@deloitte.com","id":"00000000-0000-0000-0000-000000000000"},
//{"topicName":"Sneha Gera","topicType":4,"topicValue":"sngera@deloitte.com","id":"00000000-0000-0000-0000-000000000001"},
//{"topicName":"Atishoo","topicType":4,"topicValue":"atishoo@deloitte.com","id":"00000000-0000-0000-0000-000000000003"},
//{"topicName":"mini","topicType":4,"topicValue":"mini@deloitte.com","id":"00000000-0000-0000-0000-000000000004"},
//{"topicName":"Science","topicType":3,"topicValue":"1","id":"00000000-0000-0000-0000-000000000005"},
//{"topicName":"Fiction","topicType":3,"topicValue":"2","id":"00000000-0000-0000-0000-000000000006"},
//{"topicName":"Minoxidil","topicType":3,"topicValue":"3","id":"00000000-0000-0000-0000-000000000007"},
//{"topicName":"Comedy","topicType":3,"topicValue":"4","id":"00000000-0000-0000-0000-000000000008"},
//{"topicName":"Group1","topicType":2,"topicValue":"5","id":"00000000-0000-0000-0000-000000000009"},
//{"topicName":"Group2","topicType":2,"topicValue":"6","id":"00000000-0000-0000-0000-000000000010"},
//{"topicName":"Group3","topicType":2,"topicValue":"7","id":"00000000-0000-0000-0000-000000000011"},
//{"topicName":"v1","topicType":1,"topicValue":"8","id":"00000000-0000-0000-0000-000000000012"},
//{"topicName":"v2","topicType":1,"topicValue":"9","id":"00000000-0000-0000-0000-000000000013"},
//{"topicName":"v3","topicType":1,"topicValue":"10","id":"00000000-0000-0000-0000-000000000014"}
//  ];
}
  
  onRichTextBoxChange()
  {
    
    this.messageBodyCharCount=this.notificationObj.messageBody.replace(/<[^>]*>/g, '').length;
    if(this.messageBodyCharCount>500)
    {
      this.richTextEditorerrormsgdisplay=true;
    }   
    else
    {
      this.richTextEditorerrormsgdisplay=false;
    }

  }
  
  public options: Object = {
    charCounterCount: true,
    charCounterMax: 500,
    toolbarButtons: ['bold', 'emoticons']
  };
  onHide() {
    this.onModalClose.emit("Add");
    this.notificationForm.reset();
    this.resetFields();
  }

  LoadData(notificationObj: NotificationAdd) {
    console.log(notificationObj);

  }

  LoadApplicationList(tenantId) {
    this.appService.getApplicationListByPageSize(tenantId,null).subscribe((appList: any) => {
      this.applicationList = appList.data.items;
    
      //populate sounds and images if it is edit notification
      if (this.notificationObj.id) {
        //populate sounds and images on application select
        if (this.notificationObj.application && this.notificationObj.application.id)
          this.onSelectApplication(this.notificationObj.application.id);
        //set dropdown value
        if (this.notificationObj.application.notificationSoundsFilePath.length > 0) {
          this.notificationSoundPath = this.notificationObj.application.notificationSoundsFilePath[0]["Value"];
          this.showNotificationSoundDropdown = true;
          this.notificationSoundSelected = this.notificationObj.application.notificationSoundsFilePath[0]["Key"];
        }
        if (this.notificationObj.application.notificationImagesFilePath.length > 0){
          this.notificationImagePath = this.notificationObj.application.notificationImagesFilePath[0]["Value"];
        this.showNotificationImageDropdown = true;
        this.notificationImageSelected = this.notificationObj.application.notificationImagesFilePath[0]["Key"];
        }
      }
      else{
        this.notificationObj.application.id="";
      }
    });
  }

  // LoadTopics(appId:any) {

  //   this.topicService.getTopicList(null,appId).subscribe((res: any) => {
  //     this.dropdownList = res.data.filter((item) => item.topicType != TopicType.default);
  //   });


  // }

  createNotification() {
    if (this.notificationForm.invalid)
      return;

      if(this.notificationObj.sendNotificationType==1 && (!this.selectedList || this.selectedList.length==0))
      {
      this.errorStyle=true;
        return;
      }
      this.notificationObj.isIOSNotification=this.isIOS;
      this.notificationObj.isAndroidNotification=this.isAndroid;
    if (this.notificationSoundSelected && this.notificationSoundPath)
      this.notificationObj.notificationSound = { "Key": this.notificationSoundSelected, "Value": this.notificationSoundPath };
    // else
    //   this.notificationObj.notificationSound = null;

    if (this.notificationImageSelected && this.notificationImagePath)
      this.notificationObj.notificationImage = { "Key": this.notificationImageSelected, "Value": this.notificationImagePath };
    // else
    //   this.notificationObj.notificationImage = null;

    var filteredGroups = [];
    var filteredUsers = [];
    var filteredTopics = [];

    // if (this.selectedList) {
    //   this.selectedList.forEach(element => {
    //     if (element.Category == "Groups")
    //       filteredGroups.push(element.itemName);
    //     else if (element.Category == "Users")
    //       filteredUsers.push(element.itemName);
    //     else if (element.Category == "Topics")
    //       filteredTopics.push(element.itemName);
    //   });
    // }
    // if (filteredGroups && filteredGroups.length > 0)
    //   this.notificationObj.recepientsList = [{ "Key": "Groups", "Value": filteredGroups }];
    // if (filteredUsers && filteredUsers.length > 0)
    //   this.notificationObj.recepientsList = this.notificationObj.recepientsList.concat([{ "Key": "Users", "Value": filteredUsers }]);
    // if (filteredTopics && filteredTopics.length > 0)
    //   this.notificationObj.recepientsList = this.notificationObj.recepientsList.concat([{ "Key": "Topics", "Value": filteredTopics }]);

    this.notificationObj.topics=this.selectedList;
    let isEdit=false;
    if(this.notificationObj.id)
    isEdit=true;
    var applicationName = this.notificationObj.application.name;
    if(!isEdit){
    this.notificationService.createNotification(this.tenantId, this.notificationObj,this.notificationObj.application.id).subscribe((data) => {
      this.onHide();
      this.notificationForm.reset();
      this.resetFields();
      this.toastrService.show("Notification for " + applicationName + " is successfully created");
    });
  }
  else
  {
    Object.keys(this.notificationObj).forEach(key => this.notificationObj[key] === undefined ? delete this.notificationObj[key] : '');
    Object.keys(this.notificationObj).forEach(key => this.notificationObj[key] === null ? delete this.notificationObj[key] : '');
    //remove later
    if(!this.notificationObj.isScheduled && this.notificationObj.scheduledDate){
    this.notificationObj.scheduledDate=new Date();
    this.notificationObj.scheduledTime=new Date();
    }
    this.notificationService.save(this.tenantId, this.notificationObj.id,this.notificationObj,this.notificationObj.application.id).subscribe((data) => {
      this.onHide();
      this.notificationForm.reset();
      this.resetFields();
      this.toastrService.show("Notification for " + applicationName + " is successfully saved");
     
    });
  }


  }

  setValidator() {
    //  this.notificationForm.controls.categories.setValidator([Validators.required]);
  }
  removeValidator() {
    // this.notificationForm.controls.categories.removeValidator();
  }

  resetFields() {
    this.showNotificationImageDropdown = false;
    this.showNotificationSoundDropdown = false;
    this.filteredNotificationSounds = null;
    this.filteredNotificationImages = null;
    this.refreshNotificationFields();
  }
  //for multiselect dropdown
  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  onSelectApplication(value: any) {
    if(value){
     this.isRecipientsGrpDisable=null;
    console.log("on select" + value);
    // this.LoadTopics(value);

    this.notificationObj.application.id = value;

    this.notificationObj.application.name = this.applicationList
      .filter((item) => item.id == value)[0]["name"];

    // this.notificationObj.Application.NotificationSoundsFilePath[YourKeyType] = <YourValueType> yourValue;

    this.filteredNotificationSounds = this.applicationList
      .filter((item) => item.id == value)[0]["notificationSoundsFilePath"];
    console.log(this.filteredNotificationSounds);

    if (this.filteredNotificationSounds && this.filteredNotificationSounds.length > 0)
      this.showNotificationSoundDropdown = true;
    else
      this.showNotificationSoundDropdown = false;

    this.filteredNotificationImages = this.applicationList
      .filter((item) => item.id == value)[0]["notificationImagesFilePath"];
    console.log(this.filteredNotificationSounds);

    if (this.filteredNotificationImages && this.filteredNotificationImages.length > 0)
      this.showNotificationImageDropdown = true;
    else
      this.showNotificationImageDropdown = false;

    this.refreshNotificationFields();
    }
    else
    {
      this.isRecipientsGrpDisable=true;
      this.notificationObj.sendNotificationType=-1
    }


  }

  refreshNotificationFields() {
    this.notificationSoundSelected = null;
    this.notificationImageSelected = null;
    this.notificationSoundPath = null;
    this.notificationImagePath = null;
  }

  onSelectNotificationImage(value: any, notificationObj: any) {
    this.notificationImageSelected = notificationObj
      .filter((item) => item.value == value)[0]["key"];
    this.notificationImagePath = notificationObj
      .filter((item) => item.value == value)[0]["value"];
  }
  onSelectNotificationSound(value: any, notificationObj: any) {
    this.notificationSoundSelected = notificationObj
      .filter((item) => item.value == value)[0]["key"];

    this.notificationSoundPath = notificationObj
      .filter((item) => item.value == value)[0]["value"];
  }
  downloadFile(filePath,fileType) {
    this.fileService.downloadFile(filePath,fileType);
  }
  public config = {
    toolbar: ['bold']
  };

  //Multiselect dropdown events
  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }

  public onSearch(value: any, select: NgSelectComponent) {
    this.ToggleDropdownOnSearch = true;
  }

  public onClear(value: any, select: NgSelectComponent) {
    this.ToggleDropdownOnSearch = false;
  }

  public onItemAdd(value: any, select: NgSelectComponent) {
    this.ToggleDropdownOnSearch = false;
    this.errorStyle=false;

  }

  filterCollection(value: any, categoryControl: any, topicType: any) {
    
    if (topicType == TopicType.user) {
      this.userCategory = !value;
      if(value)
      this.filtreredRecipientTypes.push(TopicType.user);
      else
      this.filtreredRecipientTypes=this.filtreredRecipientTypes.filter(i=>i!=TopicType.user);
    }
    else if (topicType == TopicType.securityGroup) {
      this.groupCategory = !value;
      if(value)
      this.filtreredRecipientTypes.push(TopicType.securityGroup);
      else
      this.filtreredRecipientTypes=this.filtreredRecipientTypes.filter(i=>i!=TopicType.securityGroup);
    }
    else if (topicType == TopicType.customTopic) {
      this.topicCategory = !value;
      if(value)
      this.filtreredRecipientTypes.push(TopicType.customTopic);
      else
      this.filtreredRecipientTypes=this.filtreredRecipientTypes.filter(i=>i!=TopicType.customTopic);
    }
    else if (topicType == TopicType.version) {
      this.versionCategory = !value;
      if(value)
      this.filtreredRecipientTypes.push(TopicType.version);
      else
      this.filtreredRecipientTypes=this.filtreredRecipientTypes.filter(i=>i!=TopicType.customTopic);
    }
    
    // if (value) {
    //   if (this.filteredList.length > 0)
    //     this.filteredList = this.filteredList.concat(this.dropdownList.filter((item) => item.topicType==topicType));
    //   else
    //     this.filteredList = this.dropdownList.filter((item) => item.topicType==topicType);
    // }
    // else {
    //   if (this.filteredList.length > 0)
    //     this.filteredList = this.filteredList.filter((item) => item.topicType!=topicType);
    // }
  }

  changeTimezone(timezone, ctrl : any) {
    this.test=this.testService.getZones();
    let testCount=this.testService.iso2country(timezone);
    var offset = this.jun.tz(timezone).utcOffset();
    this.notificationObj.zoneOffset= this.jun.tz(timezone).utcOffset(offset).format('Z');
    // this.notificationObj.zoneName=timezone;
    console.log(this.jun.tz(timezone).toLocaleString());
    var temp = new Date(this.jun.tz(timezone).toLocaleString());
    console.log(temp.getTime());
    // this.minDateValue= new Date(this.jun.tz(timezone).format());
    // this.notificationObj.scheduledDate=new Date(this.jun.tz(timezone).format());
    // this.timezone = timezone;
    // let bac= getLocaleDateTimeFormat('IN',null);

    var slectedZoneDate = new Date().toLocaleString("America/New_York");
    slectedZoneDate = new Date(slectedZoneDate).toString();
    console.log('slectedZone time: '+slectedZoneDate.toLocaleString());
  }

  clearRecipients()
  {
    this.userCategory=false;
    this.groupCategory=false;
    this.topicCategory=false;
    this.versionCategory=false;
    this.errorStyle=false;
    this.selectedList=[];
    
    // this.notificationForm.set('categories').value=null;
  }
  onSelectRecipients()
  {
    // if(this.selectedList==null || this.selectedList.length==0)
    // this.submitDisabled=true;
    // else
    // this.submitDisabled=false;

  }

  onScheduleChange(isChecked: boolean)
  {
   if(!isChecked)
   {
     this.notificationObj.scheduledDate=null;
     this.notificationObj.scheduledTime=null;
     this.notificationObj.zoneOffset=null;
     document.getElementById('select2-select-container').innerText="";
    Object.keys(this.notificationObj).forEach(key => this.notificationObj[key] === null ? delete this.notificationObj[key] : '');

   }
  }
}

export function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }

    return null;
  };
}

