import { Routes } from '@angular/router';
import { AuthPageComponent } from './auth-page.component';

export const AUTH_ROUTES: Routes = [
  { path: '', component: AuthPageComponent },
  { path: 'login', component: AuthPageComponent },
  { path: 'register', component: AuthPageComponent },
];