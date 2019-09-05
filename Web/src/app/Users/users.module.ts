import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '../shared/grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { ModalsComponent } from './modals/modals.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserUnassignComponent } from './user-unassign/user-unassign.component';
import { UserRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [    
    UserListComponent,
    UserEditComponent,
    ModalsComponent,
    UserUnassignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    NgSelectModule,
    UserRoutingModule
  ],
  exports:[    
    UserListComponent,
    UserEditComponent,
    ModalsComponent
  ]
})
export class UsersModule { }
