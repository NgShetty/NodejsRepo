import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '../shared/grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { ChartsModule } from 'ng2-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DashboardRoutingModule } from './dashboard-routing.module';
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    TimezonePickerModule,
    ChartsModule,
    NgMultiSelectDropDownModule.forRoot(),
    DashboardRoutingModule
  ],
  exports:[ DashboardComponent,
    TimezonePickerModule
     ]
})
export class DashboardModule { }
