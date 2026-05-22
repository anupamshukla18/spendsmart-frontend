import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-in">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <div class="auth-logo">🔑</div>
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a password reset OTP code</p>
          </div>
          @if (!sent) {
            <form (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" [(ngModel)]="email" name="email" placeholder="you&#64;example.com" required>
              </div>
              <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="loading">
                {{ loading ? 'Sending...' : 'Send Reset OTP' }}
              </button>
            </form>
          } @else {
            <div class="success-msg">
              <span class="success-icon">✅</span>
              <p>Password reset OTP email sent! Check your inbox.</p>
            </div>
          }
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
    .auth-header p { color: var(--text-muted); font-size: 0.9375rem; }
    .full-width { width: 100%; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 0.875rem; }
    .success-msg { text-align: center; padding: 24px; }
    .success-icon { font-size: 3rem; display: block; margin-bottom: 16px; }
    .success-msg p { color: var(--text-secondary); }
    .auth-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .bg-gradient-1 { position: absolute; top: -30%; right: -20%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, var(--color-primary-glow), transparent 70%); opacity: 0.4; }
    .bg-gradient-2 { position: absolute; bottom: -20%; left: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%); opacity: 0.5; }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  sent = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) { this.toast.warning('Please enter your email'); return; }
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Password reset OTP sent to your email!');
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.email, type: 'reset' } });
      },
      error: (err) => { this.loading = false; this.toast.error(err?.error?.message || 'Failed to send reset email'); }
    });
  }
}
