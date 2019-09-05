import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { AppPoolServiceService } from '../app-pool-service.service';
import { AppPoolAdd } from '../_models/app-pool-details';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-app-pool-add',
  templateUrl: './app-pool-add.component.html',
  styleUrls: ['./app-pool-add.component.less']
})
export class AppPoolAddComponent implements OnInit {
  //visibleModal:boolean=true;
  @Output() onModalClose = new EventEmitter();
  appPoolObj: AppPoolAdd = new AppPoolAdd();
  form: any;

  constructor(private formBuilder: FormBuilder, private apiService: AppPoolServiceService, private toastrService: ToastrService) {
    this.form = new FormGroup({
      Name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_ ]*$/), Validators.maxLength(25)]),
      Capacity: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(1), Validators.max(100)])
    });
  }

  ngOnInit() {

  }
  onHide() {
    this.onModalClose.emit("Add");
    this.form.reset();
  }
  createAppPool() {
    if (this.form.invalid)
      return;
    var poolName = this.appPoolObj.name.toLowerCase();
    if(this.appPoolObj.name)
    this.appPoolObj.name=this.appPoolObj.name.toLowerCase();
    this.apiService.createAppPool(this.appPoolObj).subscribe((data: any) => {
      this.onHide();
      this.form.reset();
      if (data.statusCode == 1)
        this.toastrService.show("Application pool " + poolName + " is successfully created");

    });


  }

}
