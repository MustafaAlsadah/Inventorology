import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ProductActions from './products.actions';
import { Product } from '../products.component';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  constructor(private http: HttpClient) {
    console.log('ProductsEffects constructor');
  }

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(() =>
        this.http
          .get<Product[]>('http://localhost:8080/api/products', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          })
          .pipe(
            map((products) => ProductActions.loadProductsSuccess({ products })),
            catchError((error) =>
              of(ProductActions.loadProductsFailure({ error }))
            )
          )
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProduct),
      mergeMap(({ product }) =>
        this.http
          .post<Product>('http://localhost:8080/api/products', product, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          })
          .pipe(
            map((newProduct) =>
              ProductActions.addProductSuccess({ product: newProduct })
            ),
            catchError((error) =>
              of(ProductActions.addProductFailure({ error }))
            )
          )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(({ id }) =>
        this.http
          .delete(`http://localhost:8080/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          })
          .pipe(
            map(() => ProductActions.deleteProductSuccess({ id })),
            catchError((error) =>
              of(ProductActions.deleteProductFailure({ error }))
            )
          )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(({ product }) =>
        this.http
          .patch<Product>(
            `http://localhost:8080/api/products/${product._id}`,
            product,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
            }
          )
          .pipe(
            map((updatedProduct) =>
              ProductActions.updateProductSuccess({ product: updatedProduct })
            ),
            catchError((error) =>
              of(ProductActions.updateProductFailure({ error }))
            )
          )
      )
    )
  );
}
