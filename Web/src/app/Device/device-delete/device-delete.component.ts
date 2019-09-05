import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceDTO } from '../_models/device';
import { DeviceService } from '../device.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-device-delete',
  templateUrl: './device-delete.component.html',
  styleUrls: ['./device-delete.component.css']
})
export class DeviceDeleteComponent implements OnInit {

  @Input() selectedDeviceRow: DeviceDTO;
  @Output() onModalClose = new EventEmitter();
  username: string = "";
  constructor(private apiService: DeviceService, private toastr: ToastrService) { }

  ngOnInit() {
    if (this.selectedDeviceRow && this.selectedDeviceRow.userID) {
      this.username = this.selectedDeviceRow.userID;
    }
  }

  onHide() {
    this.onModalClose.emit("Delete");
  }

  ConfirmDelete(Id: any) {
    
    this.apiService.deleteDevice(Id,this.selectedDeviceRow).subscribe((data) => {
      this.toastr.show("The device has deleted successfully");
      this.onHide();
    });

  }

}
