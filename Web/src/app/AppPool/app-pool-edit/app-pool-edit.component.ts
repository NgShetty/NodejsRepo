import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AppPoolAdd, AppPoolEdit } from '../_models/app-pool-details';
import { AppPoolServiceService } from '../app-pool-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-app-pool-edit',
  templateUrl: './app-pool-edit.component.html',
  styleUrls: ['./app-pool-edit.component.less']
})
export class AppPoolEditComponent implements OnInit {
  visibleModal: boolean = true;
  @Input() appPoolDetails: AppPoolEdit;
  @Output() onModalClose = new EventEmitter();
  form: any;
  constructor(private apiService: AppPoolServiceService, private toastrService: ToastrService) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_ ]*$/), Validators.maxLength(25)]),
      capacity: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1), Validators.max(100)])
    });
  }
  onHide() {
    this.onModalClose.emit("Edit");
  }
  Save(appPoolId: any, modifiedAppPoolObj: AppPoolAdd) {
    if (this.form.invalid)
      return;
    var poolName = modifiedAppPoolObj.name.toLowerCase();
    if(modifiedAppPoolObj.name)
    modifiedAppPoolObj.name=modifiedAppPoolObj.name.toLowerCase();
    this.apiService.save(appPoolId, modifiedAppPoolObj).subscribe((data) => {
      //call this method when api call is successful
      this.onHide();
      this.toastrService.show("Application pool " + poolName + " details are successfully updated");
    });


  }
}
