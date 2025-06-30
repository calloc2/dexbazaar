import { Routes } from '@angular/router';
import { ProfileRedirectComponent } from './profile/profile-redirect/profile-redirect.component';
import { LoadingGuard } from './guards/loading.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [LoadingGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'client',
    loadComponent: () => import('./client/client.page').then((m) => m.ClientPage),
    canActivate: [LoadingGuard]
  },
  {
    path: 'register-product',
    loadComponent: () => import('./register-product/register-product.component').then((m) => m.RegisterProductPage),
    canActivate: [LoadingGuard]
  },
  {
    path: 'list-products',
    loadComponent: () => import('./list-products/list-products.component').then((m) => m.ListProductsPage),
    canActivate: [LoadingGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile-redirect/profile-redirect.component').then(m => m.ProfileRedirectComponent),
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./product/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'purchase/:id',
    loadComponent: () => import('./product/purchase/purchase.component').then(m => m.PurchaseComponent),
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