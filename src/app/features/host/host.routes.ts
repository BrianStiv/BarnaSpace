import { Routes } from '@angular/router';

export const hostRoutes: Routes = [
    {
    path: 'become-host',
    loadComponent: () => import('./page/become-host-wizard/become-host-wizard.page.').then((m) => m.BecomeHostWizard),
  },
  {
    path: 'publish',
    loadComponent: () => import('./page/publish-space/publish-space.page').then((m) => m.PublishSpace),
  },
];
