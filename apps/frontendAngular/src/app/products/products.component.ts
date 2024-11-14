import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  addProduct,
  deleteProduct,
  loadProducts,
  updateProduct,
} from './ngrx/products.actions';
import { ProductsState } from './ngrx/products.reducer';
import { Store } from '@ngrx/store';
export interface Product {
  _id?: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  min_stock_alert: number;
  supplier: string;
  image_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    DataViewModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private store: Store<{ products: ProductsState }>
  ) {}
  products$!: Observable<Product[]>;
  showAddProductModal = false;
  showEditProductModal = false;
  newProduct: Product = {
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    min_stock_alert: 0,
    supplier: '',
    image_url: '',
  };
  selectedProduct: any = {
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    min_stock_alert: 0,
    supplier: '',
    // image_url: '',
  };
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (this.newProduct.sku === '') {
      alert('Please enter a SKU');
      return;
    }
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const renamedFile = new File(
        [this.selectedFile],
        this.newProduct.sku + '.png',
        { type: this.selectedFile.type }
      );
      this.selectedFile = renamedFile;
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post('http://localhost:8080/api/upload', formData).subscribe({
      next: (response: any) => {
        this.newProduct.image_url = response.url;
        console.log('newProduct', this.newProduct);
        alert('File uploaded');
      },
      error: (err) => {
        console.error('Error uploading file', err);
        alert('Error uploading file');
      },
    });
  }

  ngOnInit() {
    this.products$ = this.store.select((state) => state.products.products);
    this.store.dispatch(loadProducts());
  }

  fetchProducts() {
    this.products$ = this.http.get<Product[]>(
      'http://localhost:8080/api/products',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
  }

  addProduct(product: Product) {
    this.store.dispatch(addProduct({ product }));
    this.showAddProductModal = false;
    // console.log('Adding product', this.newProduct);
    // this.http
    //   .post<Product>('http://localhost:8080/api/products', this.newProduct, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    //     },
    //   })
    //   .subscribe({
    //     next: (prod) => {
    //       console.log('Product added', prod);
    //       this.fetchProducts();
    //       this.showAddProductModal = false;
    //       this.newProduct = {
    //         // Reset the form
    //         name: '',
    //         sku: '',
    //         price: 0,
    //         stock: 0,
    //         min_stock_alert: 0,
    //         supplier: '',
    //         image_url: '',
    //       };
    //       alert('Product added');
    //     },
    //     error: (err) => {
    //       console.error('Error adding product', err);
    //       alert('Error adding product');
    //     },
    //   });
  }

  deleteProduct(id: string) {
    this.store.dispatch(deleteProduct({ id }));
    // this.http
    //   .delete(`http://localhost:8080/api/products/${id}`, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    //     },
    //   })
    //   .subscribe({
    //     next: () => {
    //       console.log('Product deleted');
    //       this.fetchProducts();
    //       alert('Product deleted');
    //     },
    //     error: (err) => {
    //       console.error('Error deleting product', err);
    //       alert('Error deleting product');
    //     },
    //   });
  }

  editProduct(product: Product) {
    this.store.dispatch(updateProduct({ product }));
    // this.http
    //   .patch(`http://localhost:8080/api/products/${product._id}`, product, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    //     },
    //   })
    //   .subscribe({
    //     next: () => {
    //       console.log('Product updated');
    //       this.fetchProducts();
    //       alert('Product updated');
    //     },
    //     error: (err) => {
    //       console.error('Error updating product', err);
    //       alert('Error updating product');
    //     },
    //   });
  }

  openEditProductModal(product: Product) {
    this.selectedProduct = { ...product };
    this.showEditProductModal = true;
  }

  updateProduct() {
    this.editProduct(this.selectedProduct);
    this.showEditProductModal = false;
    this.selectedProduct = {
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      min_stock_alert: 0,
      supplier: '',
    };
  }
}
