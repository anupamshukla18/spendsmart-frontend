import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { GoogleAuthService } from "../../../core/services/google-auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { LoginRequest } from "../../../core/models/api.models";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-in">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <div class="auth-logo">💰</div>
            <h1>Welcome Back</h1>
            <p>Sign in to your SpendSmart account</p>
          </div>

          <form (ngSubmit)="onLogin()" class="auth-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input
                type="email"
                class="form-control"
                [(ngModel)]="form.email"
                name="email"
                placeholder="you&#64;example.com"
                required
                id="login-email"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="password-field">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  class="form-control"
                  [(ngModel)]="form.password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  class="toggle-password"
                  (click)="showPassword = !showPassword"
                >
                  {{ showPassword ? "🙈" : "👁️" }}
                </button>
              </div>
            </div>

            <div class="form-actions">
              <a routerLink="/forgot-password" class="forgot-link"
                >Forgot password?</a
              >
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg full-width"
              [disabled]="loading"
              id="login-submit"
            >
              @if (loading) {
                <span class="spinner-sm"></span> Signing in...
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="auth-divider"><span>or</span></div>
          <div #googleButton class="google-btn-container"></div>
          @if (showGoogleFallback) {
            <button type="button" class="btn btn-secondary full-width" (click)="signInWithGoogleRedirect()">
              Continue With Google
            </button>
          }

          <div class="auth-footer">
            <p>
              Don't have an account? <a routerLink="/register">Create one</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Background decoration -->
      <div class="auth-bg">
        <div class="bg-gradient-1"></div>
        <div class="bg-gradient-2"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .auth-container {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 440px;
        padding: 20px;
      }
      .auth-card {
        padding: 40px;
      }
      .auth-header {
        text-align: center;
        margin-bottom: 32px;
      }
      .auth-logo {
        font-size: 3rem;
        margin-bottom: 16px;
      }
      .auth-header h1 {
        font-size: 1.75rem;
        font-weight: 800;
        margin-bottom: 8px;
        background: linear-gradient(
          135deg,
          var(--text-primary),
          var(--color-primary-light)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .auth-header p {
        color: var(--text-muted);
        font-size: 0.9375rem;
      }
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .password-field {
        position: relative;
      }
      .toggle-password {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        font-size: 1rem;
        cursor: pointer;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
      }
      .forgot-link {
        font-size: 0.8125rem;
        color: var(--color-primary-light);
      }
      .full-width {
        width: 100%;
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
        content: "";
        flex: 1;
        height: 1px;
        background: var(--border-color, rgba(255, 255, 255, 0.1));
      }
      .google-btn-container {
        display: flex;
        justify-content: center;
        min-height: 44px;
        margin-bottom: 12px;
      }
      .btn-google {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #fff;
        color: #1f2937;
        border: 1px solid #dadce0;
        font-weight: 600;
      }
      .btn-google:hover {
        background: #f8f9fa;
      }
      .auth-footer {
        text-align: center;
        margin-top: 24px;
        font-size: 0.875rem;
        color: var(--text-muted);
      }
      .auth-footer a {
        color: var(--color-primary-light);
        font-weight: 600;
      }
      .spinner-sm {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
      .auth-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      .bg-gradient-1 {
        position: absolute;
        top: -30%;
        right: -20%;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          var(--color-primary-glow),
          transparent 70%
        );
        opacity: 0.4;
      }
      .bg-gradient-2 {
        position: absolute;
        bottom: -20%;
        left: -10%;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(245, 158, 11, 0.15),
          transparent 70%
        );
        opacity: 0.5;
      }
    `,
  ],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild("googleButton") googleButtonRef!: ElementRef<HTMLElement>;

  form: LoginRequest = { email: "", password: "" };
  loading = false;
  showPassword = false;
  showGoogleFallback = false;

  constructor(
    private authService: AuthService,
    private googleAuth: GoogleAuthService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.googleAuth
      .renderButton(this.googleButtonRef.nativeElement, (idToken) => {
        this.handleGoogleCredential(idToken);
      })
      .catch(() => {
        this.showGoogleFallback = true;
      });
  }

  signInWithGoogleRedirect(): void {
    this.googleAuth.signInWithRedirect();
  }

  private handleGoogleCredential(idToken: string): void {
    this.loading = true;
    this.authService.loginWithGoogle(idToken).subscribe({
      next: () => {
        this.toast.success("Welcome back!");
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err?.error?.message || "Google sign-in failed");
      },
    });
  }

  onLogin(): void {
    if (!this.form.email || !this.form.password) {
      this.toast.warning("Please fill in all fields");
      return;
    }
    this.loading = true;
    this.authService.login(this.form).subscribe({
      next: () => {
        this.toast.success("Welcome back! 🎉");
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.loading = false;
        const msg =
          err?.error?.message || "Login failed. Please check your credentials.";
        this.toast.error(msg);
      },
    });
  }
}
