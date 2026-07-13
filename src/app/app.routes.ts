import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageCompoent },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', redirectTo: '/home'}
];
