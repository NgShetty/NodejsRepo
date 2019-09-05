import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppPoolServiceService } from '../app-pool-service.service';
import { AppPoolAdd, AppPoolEdit } from '../_models/app-pool-details';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-app-pool-delete',
  templateUrl: './app-pool-delete.component.html',
  styleUrls: ['./app-pool-delete.component.less']
})
export class AppPoolDeleteComponent implements OnInit {
  @Input() appPoolDetails: AppPoolEdit;
  @Output() onModalClose = new EventEmitter();
  constructor(private apiService: AppPoolServiceService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  onHide() {
    this.onModalClose.emit("Delete");
  }

  ConfirmDelete(Id: any) {
    var poolName = this.appPoolDetails.name;
    this.apiService.deleteAppPool(Id).subscribe((data: any) => {
      this.onHide();
      if (data.statusCode == 1)
        this.toastrService.show("Application pool " + poolName + " is successfully deleted");
    });

  }

}
