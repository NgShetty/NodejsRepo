import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  { 
    path: "edit", 
    component: UserEditComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }