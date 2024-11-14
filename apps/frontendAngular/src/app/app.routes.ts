import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ProductsComponent } from './products/products.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { authGuard } from './auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reset-pass/:email',
    component: ResetPassComponent,
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
