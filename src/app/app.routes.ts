import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'qrcode',
    loadComponent: () =>
      import('./components/qrcode/qrcode.component').then((m) => m.QrcodeComponent)
  },
  {
    path: 'check-class',
    loadComponent: () =>
      import('./components/check-class/check-class.component').then((m) => m.CheckClassComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then((m) => m.ProfileComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
