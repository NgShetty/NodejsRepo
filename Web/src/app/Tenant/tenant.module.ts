import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'

import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantService } from './tenant.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '../shared/grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { TenantRoutingModule } from './tenant-routing';

// import {HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [
    TenantListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    TenantRoutingModule
  ],
  exports: [
    TenantListComponent
  ],
  providers: []

})
export class TenantModule { }
