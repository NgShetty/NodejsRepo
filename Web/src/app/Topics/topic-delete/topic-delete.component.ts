import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TopicService } from '../topic.service';
import { ToastrService } from 'ngx-toastr';
import { TopicListItem } from '../_models/Topics';

@Component({
  selector: 'app-topic-delete',
  templateUrl: './topic-delete.component.html',
  styleUrls: ['./topic-delete.component.css']
})
export class TopicDeleteComponent implements OnInit {
  @Input() selectedTopicRow: TopicListItem;
  @Output() onModalClose = new EventEmitter();
  constructor(private apiService: TopicService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  onHide() {
    this.onModalClose.emit("Delete");
  }

  ConfirmDelete(Id: any) {
    this.apiService.deleteTopic(Id,this.selectedTopicRow.associatedApplication.application.id).subscribe((data) => {
      this.toastr.show("The topic has deleted successfully");
      this.onHide();
    });
  }

}
