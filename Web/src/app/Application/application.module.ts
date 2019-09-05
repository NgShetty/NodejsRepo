import { NgModule } from '@angular/core';
import { ApplicationsListComponent } from './applications-list/applications-list.component';
import { HighlightQuery } from '../shared/directives/HighlightQuery';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '../shared/grid/grid.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationEditComponent } from './application-edit/application-edit.component';
import { ApplicationAddComponent } from './application-add/application-add.component';
import { ApplicationViewComponent } from './application-view/application-view.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApplicationRoutingModule } from './application.routing';


@NgModule({
  declarations: [
    ApplicationsListComponent,
    ApplicationAddComponent,
    ApplicationEditComponent,
    ApplicationViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    NgSelectModule,
    ApplicationRoutingModule
  ],
   exports: [
    ApplicationsListComponent,
    ApplicationAddComponent,
    ApplicationEditComponent,
    ApplicationViewComponent
  ]
  , providers: []
})
export class ApplicationModule { }
