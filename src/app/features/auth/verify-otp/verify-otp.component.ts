import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-in">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <div class="auth-logo">✉️</div>
            <h1>{{ type === 'reset' ? 'Reset Password OTP' : 'Verify Your Email' }}</h1>
            <p>We've sent a 6-digit OTP to</p>
            <p class="email-highlight">{{ email }}</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="otp-input-container">
              <input
                *ngFor="let digit of otpDigits; let i = index; trackBy: trackByIndex"
                #otpInput
                type="text"
                class="otp-digit"
                maxLength="1"
                pattern="[0-9]*"
                inputmode="numeric"
                [(ngModel)]="digit.val"
                [name]="'digit' + i"
                (input)="onDigitInput($event, i)"
                (keydown)="onKeyDown($event, i)"
                (paste)="onPaste($event)"
                autocomplete="one-time-code"
                required
                id="otp-input-{{ i }}"
              />
            </div>

            <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="loading || !isOtpComplete()" id="otp-submit">
              @if (loading) {
                <span class="spinner-sm"></span> Verifying...
              } @else {
                {{ type === 'reset' ? 'Verify OTP' : 'Verify & Activate' }}
              }
            </button>
          </form>

          <div class="resend-container">
            <p>Didn't receive the code?</p>
            <button class="btn-resend" [disabled]="resendCooldown > 0 || resending" (click)="onResend()" id="otp-resend">
              @if (resending) {
                Resending...
              } @else if (resendCooldown > 0) {
                Resend OTP ({{ resendCooldown }}s)
              } @else {
                Resend OTP
              }
            </button>
          </div>

          <div class="auth-footer">
            <p><a routerLink="/login">Back to Sign In</a></p>
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
    .auth-container { position: relative; z-index: 2; width: 100%; max-width: 460px; padding: 20px; }
    .auth-card { padding: 36px; text-align: center; }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-logo { font-size: 3rem; margin-bottom: 16px; }
    .auth-header h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary), var(--color-primary-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .auth-header p { color: var(--text-muted); margin: 4px 0; }
    .email-highlight { color: var(--color-primary-light) !important; font-weight: 600; word-break: break-all; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    
    .otp-input-container {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin: 20px 0;
    }
    .otp-digit {
      width: 52px;
      height: 58px;
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      border-radius: 12px;
      border: 1px solid var(--border-color, rgba(255,255,255,0.1));
      background: var(--bg-secondary, rgba(255,255,255,0.05));
      color: var(--text-primary, #fff);
      outline: none;
      transition: all 0.25s ease;
    }
    .otp-digit:focus {
      border-color: var(--color-primary-light, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
      background: var(--bg-primary, rgba(0,0,0,0.1));
    }
    
    .resend-container { margin-top: 24px; font-size: 0.875rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .btn-resend { background: none; border: none; color: var(--color-primary-light); font-weight: 600; cursor: pointer; transition: opacity 0.2s; padding: 4px 12px; border-radius: 6px; }
    .btn-resend:hover:not([disabled]) { text-decoration: underline; }
    .btn-resend[disabled] { opacity: 0.5; cursor: not-allowed; }
    
    .full-width { width: 100%; }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 0.875rem; color: var(--text-muted); }
    .auth-footer a { color: var(--color-primary-light); font-weight: 600; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .auth-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .bg-gradient-1 { position: absolute; top: -30%; right: -20%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, var(--color-primary-glow), transparent 70%); opacity: 0.4; }
    .bg-gradient-2 { position: absolute; bottom: -20%; left: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(245, 158, 11, 0.15), transparent 70%); opacity: 0.5; }
  `]
})
export class VerifyOtpComponent implements OnInit {
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  email = '';
  type = 'register';
  otpDigits = [{ val: '' }, { val: '' }, { val: '' }, { val: '' }, { val: '' }, { val: '' }];
  loading = false;
  resending = false;
  resendCooldown = 0;
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.type = this.route.snapshot.queryParamMap.get('type') || 'register';
    if (!this.email) {
      this.toast.error('Email is missing');
      this.router.navigate([this.type === 'reset' ? '/login' : '/register']);
    }
  }

  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit.val !== '' && /^[0-9]$/.test(digit.val));
  }

  onDigitInput(event: any, index: number): void {
    const val = event.target.value;
    // ensure only digits are entered
    if (val && !/^[0-9]$/.test(val)) {
      this.otpDigits[index].val = '';
      return;
    }

    if (val && index < 5) {
      setTimeout(() => {
        this.inputs.toArray()[index + 1].nativeElement.focus();
      });
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      if (!this.otpDigits[index].val && index > 0) {
        this.otpDigits[index - 1].val = '';
        setTimeout(() => {
          this.inputs.toArray()[index - 1].nativeElement.focus();
        });
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^\d{6}$/.test(pasteData)) {
      this.toast.warning('Please paste a valid 6-digit code');
      return;
    }

    for (let i = 0; i < 6; i++) {
      this.otpDigits[i].val = pasteData[i];
    }

    // focus the last box
    setTimeout(() => {
      this.inputs.toArray()[5].nativeElement.focus();
    });
  }

  onSubmit(): void {
    if (!this.isOtpComplete()) {
      this.toast.warning('Please enter a valid 6-digit OTP code');
      return;
    }

    const otp = this.otpDigits.map(d => d.val).join('');
    this.loading = true;

    if (this.type === 'reset') {
      this.authService.verifyResetOtp(this.email, otp).subscribe({
        next: () => {
          this.toast.success('OTP verified! Please set your new password.');
          this.router.navigate(['/reset-password'], { queryParams: { email: this.email, token: otp } });
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Verification failed. Please check the code.';
          this.toast.error(msg);
        }
      });
    } else {
      this.authService.verifyOtp(this.email, otp).subscribe({
        next: () => {
          this.toast.success('Email verified successfully! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'Verification failed. Please check the code.';
          this.toast.error(msg);
        }
      });
    }
  }

  clearOtpInputs(): void {
    this.otpDigits = [{ val: '' }, { val: '' }, { val: '' }, { val: '' }, { val: '' }, { val: '' }];
    setTimeout(() => {
      if (this.inputs && this.inputs.first) {
        this.inputs.first.nativeElement.focus();
      }
    });
  }

  onResend(): void {
    this.resending = true;
    const resend$ = this.type === 'reset'
      ? this.authService.forgotPassword(this.email)
      : this.authService.resendOtp(this.email);

    resend$.subscribe({
      next: () => {
        this.resending = false;
        this.clearOtpInputs();
        this.toast.success(this.type === 'reset'
          ? 'New password reset OTP sent to your email!'
          : 'New verification code sent to your email!');
        this.startCooldown();
      },
      error: (err) => {
        this.resending = false;
        const msg = err?.error?.message || 'Failed to resend code.';
        this.toast.error(msg);
      }
    });
  }

  private startCooldown(): void {
    this.resendCooldown = 60;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
}
