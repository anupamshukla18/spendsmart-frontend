import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-in">
        <div class="auth-card card-glass">
          <div class="auth-header">
            @if (loading) {
              <div class="auth-logo">⏳</div>
              <h1>Verifying Email...</h1>
            } @else if (success) {
              <div class="auth-logo">✅</div>
              <h1>Email Verified!</h1>
              <p>Your email has been verified successfully.</p>
            } @else {
              <div class="auth-logo">❌</div>
              <h1>Verification Failed</h1>
              <p>{{ errorMsg }}</p>
            }
          </div>
          <div class="auth-footer"><p><a routerLink="/login">Go to Login →</a></p></div>
        </div>
      </div>
    </div>
  `,
  styles: [`.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center}.auth-container{width:100%;max-width:440px;padding:20px}.auth-card{padding:40px;text-align:center}.auth-header{margin-bottom:24px}.auth-logo{font-size:3rem;margin-bottom:16px}.auth-header h1{font-size:1.5rem;font-weight:800;margin-bottom:8px}.auth-header p{color:var(--text-muted)}.auth-footer{margin-top:24px;font-size:.875rem}`]
})
export class VerifyEmailComponent implements OnInit {
  loading = true; success = false; errorMsg = '';
  constructor(private route: ActivatedRoute, private authService: AuthService) {}
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    this.authService.verifyEmail(token).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: (err) => { this.loading = false; this.errorMsg = err?.error?.message || 'Verification failed'; }
    });
  }
}
