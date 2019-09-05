import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../notification.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationEdit } from '../_models/notification-details';

@Component({
  selector: 'app-notification-delete',
  templateUrl: './notification-delete.component.html',
  styleUrls: ['./notification-delete.component.css']
})
export class NotificationDeleteComponent implements OnInit {

  @Input() notificationObj: NotificationEdit;
  @Output() onModalClose = new EventEmitter();

  constructor(private apiService: NotificationService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  onHide() {
    this.onModalClose.emit("Delete");
  }

  ConfirmDelete(Id: any) {
    var title = this.notificationObj.title;
    this.apiService.deleteNotification(null,Id).subscribe((data: any) => {
      this.onHide();
      if (data.statusCode == 1)
        this.toastrService.show("Application pool " + title + " is successfully deleted");
    });

  }
}
