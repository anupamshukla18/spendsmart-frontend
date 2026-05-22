import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card card-glass callback-card">
          <div class="spinner-sm"></div>
          <p>Completing Google sign-in...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .auth-container { width: 100%; max-width: 440px; padding: 20px; }
    .callback-card { text-align: center; padding: 48px; }
    .spinner-sm {
      display: inline-block;
      width: 32px;
      height: 32px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: var(--color-primary-light);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin: 0 auto 16px;
    }
  `]
})
export class OauthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const oauthError = this.route.snapshot.queryParamMap.get('error');
    const accessToken = this.route.snapshot.queryParamMap.get('accessToken');
    const refreshToken = this.route.snapshot.queryParamMap.get('refreshToken');
    const userJson = this.route.snapshot.queryParamMap.get('user') || undefined;

    if (oauthError) {
      this.toast.error('Google sign-in failed. Please try again.');
      this.router.navigate(['/login']);
      return;
    }

    if (!accessToken || !refreshToken) {
      this.toast.error('Google sign-in failed. Please try again.');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.saveOAuthCallback(accessToken, refreshToken, userJson);
    this.toast.success('Signed in with Google');
    this.router.navigate(['/dashboard']);
  }
}
