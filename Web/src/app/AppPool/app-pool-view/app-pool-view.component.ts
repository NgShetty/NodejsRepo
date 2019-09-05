import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppPoolDetails } from '../_models/app-pool-details';
import { getLocaleDateFormat } from '@angular/common';
import { AppPoolServiceService } from '../app-pool-service.service';
import { Observable } from 'rxjs';
import { TenantAllocated } from 'src/app/Tenant/_models/tenant-details';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { Roles } from 'src/app/Users/_models/user';

@Component({
  selector: 'app-app-pool-view',
  templateUrl: './app-pool-view.component.html',
  styleUrls: ['./app-pool-view.component.less']
})
export class AppPoolViewComponent implements OnInit {
  // @Output() onModalClose = new EventEmitter();
  showModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showTenantModal: boolean = false;
  changeEditImage: boolean = false;
  changeListImage: boolean = false;
  changeDeleteImage: boolean = false;
  selectedAppPoolDTO: AppPoolDetails = new AppPoolDetails();
  selectedAppPoolTenantDTO: AppPoolDetails = new AppPoolDetails();
  appPoolListObj: any[];
  tenantListObj: AppPoolDetails;
  roles = Roles;
  
  constructor(private apiService: AppPoolServiceService, private loader: LoaderService) {
    this.LoadAppPoolList();
  }

  ngOnInit() {

  }
  LoadAppPoolList() {
    this.loader.show();
    this.apiService.getAppPoolList().subscribe((appPoolDetails: any[]) => {
      this.loader.hide();
      this.appPoolListObj = appPoolDetails;
    });
  }
  createAppPool() {
     //add overflow hidden to body on modal open
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("overflowFixed");   //add the class

    this.showModal = true;
  }
  editAppPool(modifiedObj: any) {
      //add overflow hidden to body on modal open
      let body = document.getElementsByTagName('body')[0];
      body.classList.add("overflowFixed");   //add the class

    console.log(modifiedObj);
    this.selectedAppPoolDTO = modifiedObj;
    this.showEditModal = true;
  }
  deleteAppPool(modifiedObj: any) {
      //add overflow hidden to body on modal open
      let body = document.getElementsByTagName('body')[0];
      body.classList.add("overflowFixed");   //add the class

    console.log(modifiedObj);
    this.selectedAppPoolDTO = modifiedObj;
    this.showDeleteModal = true;
  }

  viewAppPoolTenants(appPoolId: any) {
    console.log(appPoolId);
    this.apiService.getTenantsList(appPoolId).subscribe((tenantList: AppPoolDetails) => {
        //add overflow hidden to body on modal open
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("overflowFixed");   //add the class
    
      this.tenantListObj = tenantList;
      this.selectedAppPoolTenantDTO = this.tenantListObj;
      this.showTenantModal = true;
    });

  }


  close($event) {

     //remove overflow hidden for body on modal close
     let body = document.getElementsByTagName('body')[0];
     body.classList.remove("overflowFixed");   //remove the class

    if ($event == "Add") {
      this.showModal = !$event;
    }
    else if ($event == "Edit") {
      this.showEditModal = !$event;
    }
    else if ($event == "Delete") {
      this.showDeleteModal = !$event;
    }
    else if ($event == "Tenant") {
      this.showTenantModal = !$event;
    }
    this.LoadAppPoolList();
  }
}
