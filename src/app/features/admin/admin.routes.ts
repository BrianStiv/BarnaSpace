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
    {
    path: 'host-requests',
    loadComponent: () =>
      import('./pages/admin-host-requests.page/admin-host-requests.page').then((m) => m.AdminHostRequestsPage),
  },
    {
    path: 'publications',
    loadComponent: () =>
      import('./pages/admin-publications.page/admin-publications.page').then((m) => m.AdminPublicationsPage),
  },
    {
    path: 'bookings',
    loadComponent: () =>
      import('./pages/admin-bookings.page/admin-bookings.page').then((m) => m.AdminBookingsPage),
  },

];
