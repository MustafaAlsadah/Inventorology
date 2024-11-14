import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router instance
  const token = localStorage.getItem('authToken');

  if (token && isTokenValid(token)) {
    return true; // Allow access if token is valid
  }

  // Redirect to the login page
  router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
  return false;
};

const isTokenValid = (token: string): boolean => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp > currentTime; // Token is valid if exp is in the future
  } catch (error) {
    console.error('Invalid token:', error);
    return false; // Token is invalid
  }
};
