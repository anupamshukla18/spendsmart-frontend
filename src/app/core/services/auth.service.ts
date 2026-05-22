import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  AuthResponse, LoginRequest, RegisterRequest,
  UserResponse, UpdateProfileRequest, ChangePasswordRequest,
  MessageResponse, ApiResponse
} from '../models/api.models';

const TOKEN_KEY = 'spendsmart_access_token';
const REFRESH_KEY = 'spendsmart_refresh_token';
const USER_KEY = 'spendsmart_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ── Auth Endpoints ─────────────────────────────────────────────

  register(request: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>('auth/register', request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/login', request).pipe(
      tap(response => this.saveSession(response))
    );
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/google', { idToken }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  saveOAuthCallback(accessToken: string, refreshToken: string, userJson?: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as UserResponse;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return;
      } catch {
        // fall through to profile fetch
      }
    }
    this.getProfile().subscribe();
  }

  logout(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/logout', {}).pipe(
      tap(() => this.clearSession())
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    return this.http.post<AuthResponse>('auth/refresh', { refreshToken }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  verifyEmail(token: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`auth/verify-email?token=${token}`);
  }

  verifyOtp(email: string, otp: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/verify-otp', { email, otp });
  }

  resendOtp(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/resend-otp', { email });
  }

  forgotPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/reset-password', { token, newPassword });
  }

  verifyResetOtp(email: string, otp: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/verify-reset-otp', { email, otp });
  }

  resetPasswordWithOtp(email: string, newPassword: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('auth/reset-password-otp', { email, newPassword });
  }

  // ── Profile Endpoints ──────────────────────────────────────────

  getProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>('auth/profile').pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>('auth/profile', request).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<MessageResponse> {
    return this.http.put<MessageResponse>('auth/password', request);
  }

  updateCurrency(currency: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>('auth/currency', { currency });
  }

  updateBudgetGoal(monthlyBudget: number): Observable<MessageResponse> {
    return this.http.put<MessageResponse>('auth/budget-goal', { monthlyBudget });
  }

  deactivateAccount(): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>('auth/deactivate');
  }

  // ── Session Management ─────────────────────────────────────────

  saveSession(auth: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, auth.accessToken);
    localStorage.setItem(REFRESH_KEY, auth.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    this.currentUserSubject.next(auth.user);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  private loadUser(): UserResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
