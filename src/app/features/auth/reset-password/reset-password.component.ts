import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-in">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <div class="auth-logo">🔐</div>
            <h1>Reset Password</h1>
            <p>Enter your new password</p>
          </div>
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">New Password</label>
              <div class="password-field">
                <input [type]="showNewPassword ? 'text' : 'password'" class="form-control"
                       [(ngModel)]="newPassword" name="newPassword"
                       placeholder="Min 8 chars, uppercase, lowercase, number, special" required>
                <button type="button" class="toggle-password" (click)="showNewPassword = !showNewPassword" aria-label="Toggle password visibility">
                  {{ showNewPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="password-field">
                <input [type]="showConfirmPassword ? 'text' : 'password'" class="form-control"
                       [(ngModel)]="confirmPassword" name="confirmPassword"
                       placeholder="Re-enter your password" required>
                <button type="button" class="toggle-password" (click)="showConfirmPassword = !showConfirmPassword" aria-label="Toggle confirm password visibility">
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="loading">
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
          <div class="auth-footer"><p><a routerLink="/login">← Back to Login</a></p></div>
        </div>
      </div>
      <div class="auth-bg"><div class="bg-gradient-1"></div><div class="bg-gradient-2"></div></div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
    .auth-container { position: relative; z-index: 2; width: 100%; max-width: 440px; padding: 20px; }
    .auth-card { padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 3rem; margin-bottom: 16px; }
    .auth-header h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
    .auth-header p { color: var(--text-muted); }
    .password-field { position: relative; }
    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      font-size: 1rem;
      cursor: pointer;
    }
    .full-width { width: 100%; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 0.875rem; }
    .auth-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .bg-gradient-1 { position: absolute; top: -30%; right: -20%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, var(--color-primary-glow), transparent 70%); opacity: 0.4; }
    .bg-gradient-2 { position: absolute; bottom: -20%; left: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%); opacity: 0.5; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit(): void {
    if (this.newPassword !== this.confirmPassword) { this.toast.warning('Passwords do not match'); return; }
    this.loading = true;

    const reset$ = this.email
      ? this.authService.resetPasswordWithOtp(this.email, this.newPassword)
      : this.authService.resetPassword(this.token, this.newPassword);

    reset$.subscribe({
      next: () => { this.toast.success('Password reset successful! Please log in.'); this.router.navigate(['/login']); },
      error: (err) => { this.loading = false; this.toast.error(err?.error?.message || 'Failed to reset password'); }
    });
  }
}
