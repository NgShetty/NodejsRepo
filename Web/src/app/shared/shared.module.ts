import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { InputTrimModule } from 'ng2-trim-directive';
import { TooltipModule } from 'ng2-tooltip-directive';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { HideIfUnauthorized } from './directives/hide-if-unathorized.directive';
import { DisableIfUnauthorizedDirective } from './directives/disable-if-unathorized.directive';
import { HideIfUnauthorizedTenant } from './directives/hideTenantIfUnauthorized.directive';
import { HideIfUnauthorizedApp } from './directives/hideApp-if-unauthorized.directive';
import { DisplayImage } from './directives/blobToImage';
import { ClickElsewhereDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [
    LoaderComponent,
    ManageTeamComponent,
    HideIfUnauthorized,
    DisableIfUnauthorizedDirective,
    HideIfUnauthorizedTenant,
    HideIfUnauthorizedApp,
    DisplayImage,
    ClickElsewhereDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTrimModule, 
    TooltipModule,   
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center'
    })
  ],
  exports:[
    LoaderComponent,
    ManageTeamComponent,
    HideIfUnauthorized,
    DisableIfUnauthorizedDirective,
    HideIfUnauthorizedTenant,
    HideIfUnauthorizedApp,
    DisplayImage,
    ClickElsewhereDirective
  ],
  providers:[
    LoaderService
  ]
})
export class SharedModule { }
