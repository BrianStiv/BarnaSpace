import { Routes } from '@angular/router';
import { NotFoundPage } from './not-found-page/not-found-page';
import { adminGuard } from './features/auth/guards/admin.guard';
import { hostGuard } from './features/auth/guards/host.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/marketplace',
    pathMatch: 'full' },
  {
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then((m) => m.marketplaceRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
    {
    path: 'host',
    canActivate: [hostGuard],
    loadChildren: () => import('./features/host/host.routes').then((m) => m.hostRoutes),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '404',
    component: NotFoundPage
  },
  {
    path: '**',
    redirectTo: '/marketplace'
  },
];
