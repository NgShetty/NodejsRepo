import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationAddComponent } from './notification-add/notification-add.component';
import { NotificationEditComponent } from './notification-edit/notification-edit.component';
import { NotificationListViewComponent } from './notification-list-view/notification-list-view.component';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { NotificationDeleteComponent } from './notification-delete/notification-delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '../shared/grid/grid.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { SharedModule } from '../shared/shared.module';
import { GroupByPipe } from '../shared/directives/customGroupBy';
import { NotificationRoutingModule } from './notification-routing.module';

@NgModule({
  declarations: [
    NotificationAddComponent,
    NotificationEditComponent,
    NotificationListViewComponent,
    NotificationViewComponent,
    NotificationDeleteComponent,
    GroupByPipe 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    QuillModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimezonePickerModule,
    SharedModule,
    NotificationRoutingModule
  ],
  exports:[
    NotificationAddComponent,
    NotificationEditComponent,
    NotificationListViewComponent,
    NotificationViewComponent,
    NotificationDeleteComponent,
    TimezonePickerModule,
    GroupByPipe
  ]
})
export class NotificationModule { }
