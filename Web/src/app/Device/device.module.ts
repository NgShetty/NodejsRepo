import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceDeleteComponent } from './device-delete/device-delete.component';
import { DeviceEditTokenComponent } from './device-edit-token/device-edit-token.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '../shared/grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { DeviceRoutingModule } from './device-routing.module';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceEditTokenComponent,
    DeviceDeleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    DeviceRoutingModule
  ],
  exports:[
    DeviceListComponent,
    DeviceEditTokenComponent,
    DeviceDeleteComponent
  ]
})
export class DeviceModule { }
