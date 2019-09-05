import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TenantAllocated } from 'src/app/Tenant/_models/tenant-details';
import { AppPoolDetails } from '../_models/app-pool-details';

@Component({
  selector: 'app-app-pool-tenants',
  templateUrl: './app-pool-tenants.component.html',
  styleUrls: ['./app-pool-tenants.component.less']
})
export class AppPoolTenantsComponent implements OnInit {
  visibleModal: boolean = true;
  @Input() appPoolTenantDetails: AppPoolDetails;
  @Output() onModalClose = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onHide() {
    this.onModalClose.emit("Tenant");
  }
}
