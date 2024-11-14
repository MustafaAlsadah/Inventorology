import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { login } from '../products/ngrx/products.reducer';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isSignin = true; // Toggles between signin and signup
  isForgotPassword = false; // Toggles between signin and forgot password
  email = '';
  password = '';
  name = ''; // Only for signup
  resetEmail = ''; // Only for forgot password

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{ loggedInReducer: { isLogged: boolean } }>
  ) {}

  toggleAuthMode() {
    this.isSignin = !this.isSignin;
  }

  toggleForgotPasswordMode(): void {
    this.isForgotPassword = !this.isForgotPassword;
  }

  onSubmit() {
    const endpoint = this.isSignin
      ? 'http://localhost:8080/api/auth/signin' // Backend signin endpoint
      : 'http://localhost:8080/api/auth/signup'; // Backend signup endpoint

    const payload = this.isSignin
      ? { email: this.email, password: this.password }
      : { name: this.name, email: this.email, password: this.password };

    this.http.post(endpoint, payload).subscribe({
      next: (response: any) => {
        if (this.isSignin) {
          // Store token and navigate to the products page
          localStorage.setItem('authToken', response.token);
          this.store.dispatch(login());

          alert('Signin successful!');
          this.router.navigate(['/products']);
        } else {
          alert('Signup successful! Please sign in.');
          this.toggleAuthMode();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Authentication failed. Please try again.');
      },
    });
  }

  onForgotPasswordSubmit(): void {
    this.http
      .post('http://localhost:8080/api/auth/send-password-reset-email', {
        email: this.resetEmail,
      })
      .subscribe({
        next: () => {
          alert('Password reset email sent.');
          this.toggleForgotPasswordMode();
        },
      });
  }
}
