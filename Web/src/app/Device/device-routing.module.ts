import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DeviceListComponent } from './device-list/device-list.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeviceRoutingModule { }