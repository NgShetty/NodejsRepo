import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeviceDTO } from '../_models/device';
import { DeviceService } from '../device.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-device-edit-token',
  templateUrl: './device-edit-token.component.html',
  styleUrls: ['./device-edit-token.component.css']
})
export class DeviceEditTokenComponent implements OnInit {

  form: any;
  @Output() onModalClose = new EventEmitter();
  @Input() selectedDeviceRow: DeviceDTO;
  @Input() manualEdit: boolean;

  constructor(private deviceService: DeviceService, private toastr: ToastrService) {
    this.form = new FormGroup({
      token: new FormControl(null, [Validators.required])
    });

  }

  ngOnInit() {
  }

  onHide() {
    this.onModalClose.emit("Edit");
    // this.form.reset();
  }
  saveToken() {
    if (this.form.invalid)
      return;
    this.deviceService.save(this.selectedDeviceRow.id, this.selectedDeviceRow).subscribe((data) => {
      this.toastr.show("Notification token has been edited successfully");
      this.onHide();
      this.form.reset();
    });
  }

  /* To copy token from Textbox */
  copyToken(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  restoreOriginalToken() {
    this.selectedDeviceRow.newNotificationToken = this.selectedDeviceRow.oldNotificationToken;
  }

}
