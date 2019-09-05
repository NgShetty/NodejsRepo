import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TopicsListComponent } from './topics-list/topics-list.component';

const routes: Routes = [
  {
    path: '',
    component: TopicsListComponent        
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TopicRoutingModule { }