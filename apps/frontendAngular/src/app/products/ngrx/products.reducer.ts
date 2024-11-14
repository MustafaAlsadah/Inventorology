import { createAction, createReducer, on } from '@ngrx/store';
import { Product } from '../products.component';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  addProductSuccess,
  deleteProductSuccess,
  updateProductSuccess,
} from './products.actions';

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: any;
}

export const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export interface isLoggedInState {
  isLogged: boolean;
}

export const initialLoggedInState: isLoggedInState = {
  isLogged: localStorage.getItem('authToken') !== null,
};

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({ ...state, loading: true })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    products,
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
  })),
  on(deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p._id !== id),
  })),
  on(updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p._id === product._id ? product : p)),
  }))
);

export const logout = createAction('[Header] Logout');
export const login = createAction('[Header] Login');
export const loggedInReducer = createReducer(
  initialLoggedInState,
  on(logout, () => ({ isLogged: false })),
  on(login, () => ({ isLogged: true }))
);
