import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserResponse } from '../../../core/models/api.models';
import { interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="btn-icon mobile-menu" (click)="toggleSidebar.emit()">☰</button>
        <div class="greeting">
          <h2>{{ getGreeting() }}, {{ (user?.fullName?.split(' ') || [])[0] || 'User' }}! 👋</h2>
          <p>{{ today | date:'EEEE, MMMM d, y' }}</p>
        </div>
      </div>

      <div class="header-right">
        <!-- Notification bell -->
        <button class="btn-icon notification-btn" (click)="goToNotifications()">
          🔔
          @if (unreadCount > 0) {
            <span class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          }
        </button>

        <!-- User avatar -->
        <div class="user-menu" (click)="showDropdown = !showDropdown">
          <div class="user-avatar">
            {{ user?.fullName?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          @if (showDropdown) {
            <div class="dropdown">
              <div class="dropdown-header">
                <strong>{{ user?.fullName }}</strong>
                <span>{{ user?.email }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" (click)="goToSettings()">⚙️ Settings</button>
              <button class="dropdown-item danger" (click)="onLogout()">🚪 Logout</button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      height: var(--header-height);
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-xl);
      z-index: 50;
      transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .mobile-menu {
      display: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 1.25rem;
    }

    .greeting h2 {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .greeting p {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .notification-btn {
      position: relative;
      background: var(--bg-elevated);
      color: var(--text-primary);
      font-size: 1.125rem;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }

    .notification-btn:hover {
      background: var(--bg-card-hover);
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--color-danger);
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    .user-menu {
      position: relative;
      cursor: pointer;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9375rem;
      transition: all var(--transition-fast);
    }

    .user-avatar:hover {
      box-shadow: 0 0 0 3px var(--color-primary-glow);
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 8px;
      min-width: 220px;
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.15s ease;
      z-index: 200;
    }

    .dropdown-header {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .dropdown-header strong {
      font-size: 0.9375rem;
    }

    .dropdown-header span {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-subtle);
      margin: 4px 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-align: left;
      transition: all var(--transition-fast);
    }

    .dropdown-item:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }

    .dropdown-item.danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--color-danger);
    }

    @media (max-width: 768px) {
      .header {
        left: 0;
      }
      .mobile-menu {
        display: flex;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  user: UserResponse | null = null;
  unreadCount = 0;
  showDropdown = false;
  today = new Date();
  private pollingSub?: Subscription;
  private isFirstLoad = true;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.user = user);
    this.notificationService.unreadCount$.subscribe(count => {
      if (!this.isFirstLoad && count > this.unreadCount) {
        this.toastService.info('New notification received');
      }
      this.unreadCount = count;
      this.isFirstLoad = false;
    });

    // Start polling every 10 seconds
    this.pollingSub = interval(10000).pipe(
      startWith(0)
    ).subscribe(() => {
      this.notificationService.refreshUnreadCount();
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: res => this.unreadCount = res?.data?.unreadCount || 0,
      error: () => {}
    });
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  goToSettings(): void {
    this.showDropdown = false;
    this.router.navigate(['/settings']);
  }

  onLogout(): void {
    this.showDropdown = false;
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
