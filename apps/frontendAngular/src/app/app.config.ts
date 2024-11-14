import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore, StoreModule } from '@ngrx/store';
import {
  productsReducer,
  loggedInReducer,
} from './products/ngrx/products.reducer';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { ProductsEffects } from './products/ngrx/products.effects';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore({
      products: productsReducer,
      loggedInReducer: loggedInReducer,
    }),
    provideEffects(ProductsEffects),
  ],
};
