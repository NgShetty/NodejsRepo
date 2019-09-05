import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPoolEditComponent } from './app-pool-edit/app-pool-edit.component';
import { AppPoolViewComponent } from './app-pool-view/app-pool-view.component';
import { AppPoolAddComponent } from './app-pool-add/app-pool-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMinDirective } from '../shared/directives/CustomMinNumber';
import { AppPoolDeleteComponent } from './app-pool-delete/app-pool-delete.component';
import { AppPoolTenantsComponent } from './app-pool-tenants/app-pool-tenants.component';
import { SharedModule } from '../shared/shared.module';
import { AppPoolRoutingModule } from './app-pool-routing';

@NgModule({
  declarations: [
    AppPoolAddComponent,
    AppPoolEditComponent,
    AppPoolViewComponent,
    AppPoolDeleteComponent,
    AppPoolTenantsComponent,
    CustomMinDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AppPoolRoutingModule
  ],
  exports: [
    AppPoolAddComponent,
    AppPoolEditComponent,
    AppPoolViewComponent
  ]
})
export class AppPoolModule { }
