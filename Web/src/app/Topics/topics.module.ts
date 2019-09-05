import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicAddComponent } from './topic-add/topic-add.component';
import { TopicDeleteComponent } from './topic-delete/topic-delete.component';
import { TopicEditComponent } from './topic-edit/topic-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '../shared/grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TopicRoutingModule } from './topic-routing.module';

@NgModule({
  declarations: [    
    TopicsListComponent,
    TopicAddComponent,
    TopicDeleteComponent,
    TopicEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    NgSelectModule,
    TopicRoutingModule
  ],
  exports:[
    TopicsListComponent,
    TopicAddComponent,
    TopicDeleteComponent,
    TopicEditComponent,
  ]
})
export class TopicsModule { }
