import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { ChartsModule } from 'ng2-charts';
import { GridModule } from '../shared/grid/grid.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReportRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    TimezonePickerModule,
    ChartsModule,
    GridModule,
    NgMultiSelectDropDownModule.forRoot(),
    ReportRoutingModule
  ],
  exports: [
    ReportsComponent,
    TimezonePickerModule
  ]
})
export class ReportsModule { }
