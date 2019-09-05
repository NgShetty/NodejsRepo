import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotificationEdit, NotificationDetails } from '../_models/notification-details';

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css']
})
export class NotificationViewComponent implements OnInit {
  @Output() onModalClose = new EventEmitter();
  @Input() notificationObj: NotificationDetails;
  constructor() { }

  ngOnInit() {
  }

  onHide() {
    this.onModalClose.emit("View");
  }
}
