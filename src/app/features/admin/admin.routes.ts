import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
    path: 'dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then((m) => m.AdminDashboard),
  },
      {
    path: 'users',
    loadComponent: () => import('./pages/admin-users.page/admin-users.page').then((m) => m.AdminUsersPage),
  },
];
