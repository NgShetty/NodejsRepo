import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplicationsListComponent } from './applications-list/applications-list.component';
import { ApplicationViewComponent } from './application-view/application-view.component';
import { ApplicationEditComponent } from './application-edit/application-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationsListComponent        
  },
  { 
    path: "viewapplication",
    component: ApplicationViewComponent
  },
  { 
    path: "edit", 
    component: ApplicationEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ApplicationRoutingModule { }