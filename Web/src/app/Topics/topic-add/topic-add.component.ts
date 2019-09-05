import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { TopicService } from '../topic.service';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/Application/application.service';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-topic-add',
  templateUrl: './topic-add.component.html',
  styleUrls: ['./topic-add.component.css']
})
export class TopicAddComponent implements OnInit {

  @Output() onModalClose = new EventEmitter();
   @Input() topic : any;
   @Input() tenantId: any;
   form:any;
   editMode: boolean = false;
   applicationList: any[];
   topicName: string="";
   selectedApp:any;
   securityGroups: any[];
   toggleDropdownOnSearch: boolean = false;
  constructor(private topicService: TopicService, private toastr: ToastrService, private appService: ApplicationService, private loader: LoaderService) { 

  }

  ngOnInit() {
    this.topicName="";
    if(this.tenantId)
    this.LoadApplicationList(this.tenantId);
    else
    this.LoadApplicationList(null);
     // for edit topic
     if (this.topic.id) {
      this.editMode = true;
      this.selectedApp=this.topic.associatedApplication.application;
      if(this.topic.topicValue)
      this.topicName=this.topic.topicName.split("-")[0];
      else
      this.topicName=this.topic.topicName;
    }
    else
    {
      this.topic.topicStatus=true;
      this.topic.topicType=3;
    }
   
    this.form = new FormGroup({
      // name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
      associatedApp: new FormControl(null, [Validators.required]),
      topicType: new FormControl(null, [Validators.required]),
      topicStatus: new FormControl(null),
      versionName:new FormControl(null),
      groupName:new FormControl() 
    },this.validateIfChecked());
  }

  validateIfChecked(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
      const topicType = form.get('topicType');
      const versionName= form.get('versionName');
      const groupName = form.get('groupName');
      if ((topicType.value==1 && !versionName.value) || (topicType.value==3 && !versionName.value) || (topicType.value==2 && !groupName.value)) {
        return {
          'err': true
        };
      }
      return null;
    }
  }

  onHide() {
    this.loader.hide();
    this.onModalClose.emit("Add");
    // this.form.reset();
  }
  createTopic() {
     if(this.form.invalid)
     return;
    this.loader.show();
    if(this.topic.topicValue)
    this.topic.topicName=this.topicName+"-"+this.topic.topicValue;
    else
    this.topic.topicName=this.topicName;

    this.topicService.create(this.topic,this.topic.associatedAppId).subscribe((data) => {
    this.onHide();
    this.toastr.show("Topic "+this.topicName+" has been created successfully");
    this.form.reset();
    });
  }
  saveTopic() {
    if(this.form.invalid)
    return;
    this.loader.show();
    if(this.topic.topicValue)
    this.topic.topicName=this.topicName+"-"+this.topic.topicValue;
    else
    this.topic.topicName=this.topicName;
   this.topicService.save(this.topic.id, this.topic,this.topic.associatedAppId).subscribe((data) => {
   this.onHide();
   this.toastr.show("Topic "+this.topicName+" has been saved successfully");
   this.form.reset();
   });
 }

 
 onSelectApplication(event:any,selectedAppId: any) {
   
  this.topic.associatedAppId=selectedAppId;
  let selectedApp = this.applicationList.filter(item=>item.id==selectedAppId);
  if(selectedApp && selectedApp.length>0)
  this.topicName=selectedApp[0].name;
  console.log(this.selectedApp);
  // alert("on app dropdown change");
  // console.log("on select" + value);
  // this.topic.associatedApp.id = value;
  if(this.editMode)
  this.topic.associatedApp = {};

}

LoadApplicationList(tenantId) {
  this.appService.getApplicationListByPageSize(tenantId,null).subscribe((appList: any) => {
    this.applicationList = appList.data.items;
    if(this.editMode && this.topic.associatedApplication){
    this.topic.associatedAppId=this.topic.associatedApplication.application.id;
    }
    else
    {
      this.topic.associatedAppId=""; 
    }
  });
}

onTopicChange(topicType:number)
{
  this.topic.topicValue="";
  
  if(topicType==2)
  this.loadADSecurityGroups();
}


loadADSecurityGroups()
{
  this.topicService.getSecurityGroups("https://graph.microsoft.com/v1.0/groups?$orderby=displayName").subscribe((result:any) => {
    this.securityGroups = result.value;
});
}

onSearch(event:any)
{
  if(event && event.term && event.term.length>3)
  this.toggleDropdownOnSearch=true;
}

public onItemAdd(value: any, select: NgSelectComponent) {
  this.toggleDropdownOnSearch=false;
}

closeDropdown(event:any)
{
  this.toggleDropdownOnSearch=false;
}

}
