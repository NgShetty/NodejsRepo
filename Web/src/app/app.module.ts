import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AdalService } from './shared/services/adal.service';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { routes } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './shared/token-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from './shared/grid/grid.module';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { AuthGuard } from './shared/authentication/auth.guard';
import { AuthenticationService } from './shared/authentication/authentication.service';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent  
  ],
  imports: [
    routes,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GridModule,
    SharedModule,
  ],

  providers: [AdalService, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, },AuthenticationService,AuthGuard],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
