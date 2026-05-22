import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UserResponse, UpdateProfileRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Profile Settings</h3>
          </div>
          <form (ngSubmit)="updateProfile()">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="profileReq.fullName" name="fullName">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" [value]="user?.email" disabled>
              <small class="form-error" style="color: var(--text-muted);">Email cannot be changed</small>
            </div>
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea class="form-control" [(ngModel)]="profileReq.bio" name="bio" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Timezone</label>
              <select class="form-select" [(ngModel)]="profileReq.timezone" name="timezone">
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="savingProfile">
              {{ savingProfile ? 'Saving...' : 'Save Profile' }}
            </button>
          </form>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="card">
            <div class="card-header">
              <h3>Preferences</h3>
            </div>
            <div class="form-group">
              <label class="form-label">Default Currency</label>
              <div style="display: flex; gap: 8px;">
                <select class="form-select" [(ngModel)]="currency" name="currency">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <button class="btn btn-secondary" (click)="updateCurrency()" [disabled]="updatingCurrency">
                  {{ updatingCurrency ? 'Updating...' : 'Update' }}
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Global Monthly Budget Goal</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" class="form-control" [(ngModel)]="monthlyBudget" name="budget">
                <button class="btn btn-secondary" (click)="updateBudget()" [disabled]="updatingBudget">
                  {{ updatingBudget ? 'Updating...' : 'Update' }}
                </button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h3>Account Status</h3>
              <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Active</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span style="color: var(--text-muted); font-size: 0.875rem;">Member Since</span>
                <span style="font-weight: 500; font-size: 0.875rem; color: var(--text-light);">{{ user?.createdAt | date:'mediumDate' }}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span style="color: var(--text-muted); font-size: 0.875rem;">Auth Provider</span>
                <span style="font-weight: 500; font-size: 0.875rem; text-transform: capitalize; color: var(--text-light);">{{ user?.provider }}</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--text-muted); font-size: 0.875rem;">Email Status</span>
                <span style="font-weight: 500; font-size: 0.875rem; color: #10b981;">Verified ✓</span>
              </div>
            </div>
          </div>

          <div *ngIf="user?.provider === 'LOCAL'" class="card animate-in">
            <div class="card-header">
              <h3>Security Settings</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0; line-height: 1.6; text-align: left;">
                To change your password, click the button below. We will send a 6-digit One-Time Password (OTP) to your registered email to verify your identity.
              </p>
              <button type="button" class="btn btn-secondary" style="width: 100%;" (click)="requestPasswordChange()" [disabled]="requestingPasswordChange" id="settings-change-password">
                {{ requestingPasswordChange ? 'Sending OTP...' : 'Change Password' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-header h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 20px; }
  `]
})
export class SettingsComponent implements OnInit {
  user: UserResponse | null = null;
  profileReq: UpdateProfileRequest = {};
  
  currency = 'INR';
  monthlyBudget = 0;
  
  savingProfile = false;
  updatingCurrency = false;
  updatingBudget = false;
  requestingPasswordChange = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
      if (u) {
        this.profileReq = {
          fullName: u.fullName,
          bio: u.bio || '',
          timezone: u.timezone
        };
        this.currency = u.currency;
        this.monthlyBudget = u.monthlyBudget || 0;
      }
    });
  }

  updateProfile(): void {
    this.savingProfile = true;
    this.authService.updateProfile(this.profileReq).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully');
        this.savingProfile = false;
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to update profile');
        this.savingProfile = false;
      }
    });
  }

  updateCurrency(): void {
    this.updatingCurrency = true;
    this.authService.updateCurrency(this.currency).subscribe({
      next: () => {
        this.authService.getProfile().subscribe({
          next: () => {
            this.toast.success(`Currency updated to ${this.currency}. Existing amounts were converted too.`);
            this.updatingCurrency = false;
          },
          error: () => {
            this.updatingCurrency = false;
            this.toast.warning('Currency updated, but profile refresh failed. Please reload once.');
          }
        });
      },
      error: (err) => {
        this.updatingCurrency = false;
        this.toast.error(err?.error?.message || 'Failed to update currency');
      }
    });
  }

  updateBudget(): void {
    this.updatingBudget = true;
    this.authService.updateBudgetGoal(this.monthlyBudget).subscribe({
      next: () => {
        this.toast.success('Global budget goal updated');
        this.authService.getProfile().subscribe();
        this.updatingBudget = false;
      },
      error: (err) => {
        this.updatingBudget = false;
        this.toast.error(err?.error?.message || 'Failed to update budget goal');
      }
    });
  }

  requestPasswordChange(): void {
    if (!this.user?.email) return;
    this.requestingPasswordChange = true;
    this.authService.forgotPassword(this.user.email).subscribe({
      next: () => {
        this.requestingPasswordChange = false;
        this.toast.success('Password reset OTP sent to your email!');
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.user?.email, type: 'reset' } });
      },
      error: (err) => {
        this.requestingPasswordChange = false;
        this.toast.error(err?.error?.message || 'Failed to send verification code');
      }
    });
  }
}
