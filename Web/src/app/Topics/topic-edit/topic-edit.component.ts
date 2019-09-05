import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TopicService } from '../topic.service';
import { ToastrService } from 'ngx-toastr';
import { AddTopic } from '../_models/Topics';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.css']
})
export class TopicEditComponent implements OnInit {

  form: any;
  @Output() onModalClose = new EventEmitter();
  @Input() selectedTopicRow: AddTopic;

  constructor(private topicService: TopicService, private toastr: ToastrService) { 
    
  }

  ngOnInit() {
  }

  onHide() {
    this.onModalClose.emit("Edit");
   // this.form.reset();
  }
  saveToken()
  {
   if(this.form.invalid)
   return;
    // this.deviceService.saveToken(this.selectedDeviceRow.id,this.selectedDeviceRow).subscribe((data) => {
    // this.toastr.show("Notification token has been edited successfully");
    // this.onHide();
    // this.form.reset();
    // });
  }

}
