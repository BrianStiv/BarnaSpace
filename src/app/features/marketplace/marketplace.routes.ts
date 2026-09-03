import { Routes } from '@angular/router';

export const marketplaceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-marketplace/home-marketplace').then((m) => m.HomeMarketplace),
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results-grid/results-grid').then((m) => m.ResultsGrid),
  },
  {
    path: 'space/:id',
    loadComponent: () => import('./pages/space-detail/space-detail').then((m) => m.SpaceDetail),
  },
  {
  path: 'my-bookings',
  loadComponent: () => import('./pages/my-bookings.page/my-bookings.page').then((m) => m.MyBookingsPage),
  },
];
