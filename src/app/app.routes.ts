import { Routes } from '@angular/router';
import { NotFoundPage } from './not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
  {
    path: 'marketplace',
    loadChildren: () =>
      import('./features/marketplace/marketplace.routes').then((m) => m.marketplaceRoutes),
  },
  { path: '404', component: NotFoundPage },
  { path: '**', redirectTo: '/marketplace' },
];
