import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../products/ngrx/products.reducer';
import { isLoggedIn } from '../products/ngrx/products.reducer';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
  username: string | null = '';
  isLoggedIn!: boolean;

  constructor(
    private router: Router,
    private store: Store<{ loggedInReducer: isLoggedIn }>
  ) {
    this.store.select('loggedInReducer').subscribe((state) => {
      console.log(state);
      this.isLoggedIn = state.isLogged;
    });
  }

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'User';
  }

  onLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.logout.emit();
    this.router.navigate(['/auth']);
    window.location.reload();
    this.store.dispatch(logout());
  }
}
