import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { RegisterRequest } from '../../../core/models/api.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-in">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <div class="auth-logo">💰</div>
            <h1>Create Account</h1>
            <p>Start your smart financial journey</p>
          </div>

          <form (ngSubmit)="onRegister()" class="auth-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="form.fullName"
                     name="fullName" placeholder="John Doe" required id="register-name">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="form.email"
                     name="email" placeholder="you&#64;example.com" required id="register-email">
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="password-field">
                <input [type]="showPassword ? 'text' : 'password'" class="form-control"
                       [(ngModel)]="form.password" name="password"
                       placeholder="Min 8 chars, uppercase, lowercase, number, special" required id="register-password">
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword" aria-label="Toggle password visibility">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" [style.width]="passwordStrength + '%'"
                       [class.weak]="passwordStrength < 40"
                       [class.medium]="passwordStrength >= 40 && passwordStrength < 80"
                       [class.strong]="passwordStrength >= 80"></div>
                </div>
                <span class="strength-label">{{ passwordLabel }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Currency</label>
                <select class="form-select" [(ngModel)]="form.currency" name="currency" id="register-currency">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Timezone</label>
                <select class="form-select" [(ngModel)]="form.timezone" name="timezone" id="register-timezone">
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="loading" id="register-submit">
              @if (loading) {
                <span class="spinner-sm"></span> Creating account...
              } @else {
                Create Account
              }
            </button>
          </form>

          <div class="auth-divider"><span>or</span></div>
          <div #googleButton class="google-btn-container"></div>
          @if (showGoogleFallback) {
            <button type="button" class="btn btn-secondary btn-lg full-width" (click)="signInWithGoogleRedirect()">
              Continue With Google
            </button>
          }

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </div>
      </div>
      <div class="auth-bg">
        <div class="bg-gradient-1"></div>
        <div class="bg-gradient-2"></div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .auth-container { position: relative; z-index: 2; width: 100%; max-width: 480px; padding: 20px; }
    .auth-card { padding: 36px; }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-logo { font-size: 3rem; margin-bottom: 16px; }
    .auth-header h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary), var(--color-primary-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .auth-header p { color: var(--text-muted); }
    .auth-form { display: flex; flex-direction: column; gap: 4px; }
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
    .auth-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
      color: var(--text-muted);
      font-size: 0.8125rem;
    }
    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color, rgba(255,255,255,0.1));
    }
    .google-btn-container { display: flex; justify-content: center; min-height: 44px; margin-bottom: 12px; }
    .btn-google {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: #fff; color: #1f2937; border: 1px solid #dadce0; font-weight: 600;
    }
    .btn-google:hover { background: #f8f9fa; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 0.875rem; color: var(--text-muted); }
    .auth-footer a { color: var(--color-primary-light); font-weight: 600; }
    .password-strength { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
    .strength-bar { flex: 1; height: 4px; background: var(--bg-secondary); border-radius: var(--radius-full); overflow: hidden; }
    .strength-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.3s ease; }
    .strength-fill.weak { background: var(--color-danger); }
    .strength-fill.medium { background: var(--color-warning); }
    .strength-fill.strong { background: var(--color-success); }
    .strength-label { font-size: 0.75rem; color: var(--text-muted); min-width: 50px; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .auth-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .bg-gradient-1 { position: absolute; top: -30%; right: -20%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, var(--color-primary-glow), transparent 70%); opacity: 0.4; }
    .bg-gradient-2 { position: absolute; bottom: -20%; left: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(245, 158, 11, 0.15), transparent 70%); opacity: 0.5; }
  `]
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('googleButton') googleButtonRef!: ElementRef<HTMLElement>;

  form: RegisterRequest = { fullName: '', email: '', password: '', currency: 'INR', timezone: 'Asia/Kolkata' };
  loading = false;
  showPassword = false;
  showGoogleFallback = false;

  constructor(
    private authService: AuthService,
    private googleAuth: GoogleAuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.googleAuth.renderButton(this.googleButtonRef.nativeElement, (idToken) => {
      this.loading = true;
      this.authService.loginWithGoogle(idToken).subscribe({
        next: () => {
          this.toast.success('Account ready! Welcome to SpendSmart');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.toast.error(err?.error?.message || 'Google sign-up failed');
        }
      });
    }).catch(() => {
      this.showGoogleFallback = true;
    });
  }

  signInWithGoogleRedirect(): void {
    this.googleAuth.signInWithRedirect();
  }

  get passwordStrength(): number {
    const p = this.form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9]/.test(p)) score += 25;
    if (/[!@#$%^&*]/.test(p)) score += 25;
    return score;
  }

  get passwordLabel(): string {
    if (this.passwordStrength < 40) return 'Weak';
    if (this.passwordStrength < 80) return 'Medium';
    return 'Strong';
  }
  onRegister(): void {
    if (!this.form.fullName || !this.form.email || !this.form.password) {
      this.toast.warning('Please fill in all required fields');
      return;
    }
    this.loading = true;
    this.authService.register(this.form).subscribe({
      next: () => {
        this.toast.success('Account created! Please check your email for the 6-digit OTP verification code.');
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.form.email } });
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Registration failed. Please try again.';
        this.toast.error(msg);
      }
    });
  }
}
