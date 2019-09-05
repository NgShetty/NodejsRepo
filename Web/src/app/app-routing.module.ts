import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/authentication/auth.guard';
import { Roles } from './Users/_models/user';

const router: Routes = [
  {
    path: 'appPool',
    loadChildren: () => import('./AppPool/app-pool-module').then(mod => mod.AppPoolModule),
    canActivate: [AuthGuard], data: { roles: [Roles.SystemAdmin,Roles.SystemReader] }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: 'tenant',
    loadChildren: () => import('./Tenant/tenant.module').then(mod => mod.TenantModule),
    canActivate: [AuthGuard], data: { roles: [Roles.SystemAdmin,Roles.SystemReader,Roles.TenantOwner,Roles.TenantReader] }
  },
  {
    path: 'topic',
    loadChildren: () => import('./Topics/topics.module').then(mod => mod.TopicsModule)
  },
  {
    path: 'application',
    loadChildren: () => import('./Application/application.module').then(mod => mod.ApplicationModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then(mod => mod.NotificationModule)
  },
  {
    path: 'device',
    loadChildren: () => import('./Device/device.module').then(mod => mod.DeviceModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(mod => mod.ReportsModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./Users/users.module').then(mod => mod.UsersModule),
    canActivate: [AuthGuard], data: { roles: [Roles.SystemAdmin,Roles.SystemReader] }
  }
];

export class AppRoutingModule { }

export const routes: ModuleWithProviders = RouterModule.forRoot(router, { useHash: true });
