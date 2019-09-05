import { Routes, RouterModule } from '@angular/router';
import { AppPoolViewComponent } from './app-pool-view/app-pool-view.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AppPoolViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppPoolRoutingModule { }