import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page-component/home-page-component';
import { NotFoundPage } from './not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: '404', component: NotFoundPage },
  { path: '**', redirectTo: '/home'}
];