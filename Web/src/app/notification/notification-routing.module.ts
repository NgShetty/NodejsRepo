import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotificationListViewComponent } from './notification-list-view/notification-list-view.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationListViewComponent        
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NotificationRoutingModule { }