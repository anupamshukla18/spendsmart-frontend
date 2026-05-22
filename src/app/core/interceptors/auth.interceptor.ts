import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Attaches JWT Bearer token to outgoing requests and handles 401 responses.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  // Skip token attachment for auth endpoints (login, register, etc.)
  const skipUrls = [
    'auth/login',
    'auth/register',
    'auth/google',
    'auth/refresh',
    'auth/forgot-password',
    'auth/reset-password',
    'auth/verify-email',
    'auth/verify-otp',
    'auth/resend-otp',
    'auth/verify-reset-otp',
    'auth/reset-password-otp'
  ];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  if (!shouldSkip) {
    const token = authService.getAccessToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        authService.clearSession();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
