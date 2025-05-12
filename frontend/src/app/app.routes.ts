import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'register-house',
    loadComponent: () => import('./register-house/register-house.page').then((m) => m.RegisterHousePage),
  },
  {
    path: 'list-houses',
    loadComponent: () => import('./list-houses/list-houses.page').then((m) => m.ListHousesPage),
  },
  {
    path: 'client',
    loadComponent: () => import('./client/client.page').then((m) => m.ClientPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.page').then((m) => m.NotFoundPage),
  }
];