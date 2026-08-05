import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
    path: 'dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then((m) => m.AdminDashboard),
  },
];
