import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { Notification } from '../../core/models/api.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Alerts, insights, and updates</p>
        </div>
        @if (notifications.length > 0) {
          <button class="btn btn-secondary" (click)="markAllRead()">Mark all as read</button>
        }
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      } @else if (notifications.length === 0) {
        <div class="card empty-state">
          <div class="empty-state-icon">🔕</div>
          <h3>All caught up!</h3>
          <p>You don't have any notifications at the moment.</p>
        </div>
      } @else {
        <div class="notification-list">
          @for (notif of notifications; track notif.notificationId) {
            <div class="notification-item card" [class.unread]="!notif.isRead">
              <div class="notif-icon" [ngClass]="notif.severity">
                {{ getIcon(notif.type) }}
              </div>
              <div class="notif-content">
                <h4>{{ notif.title }}</h4>
                <p>{{ notif.message }}</p>
                <span class="notif-time">{{ notif.createdAt | date:'medium' }}</span>
              </div>
              <div class="notif-actions">
                @if (!notif.isRead) {
                  <button class="btn-icon btn-ghost" (click)="markRead(notif.notificationId)" title="Mark as read">✓</button>
                }
                <button class="btn-icon btn-ghost" (click)="deleteNotif(notif.notificationId)" title="Delete">🗑️</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-list { display: flex; flex-direction: column; gap: 12px; }
    .notification-item {
      display: flex; gap: 16px; padding: 16px; align-items: flex-start;
      border-left: 4px solid transparent;
      transition: all var(--transition-fast);
    }
    .notification-item.unread { background: var(--bg-card-hover); border-left-color: var(--color-primary); }
    .notif-icon {
      width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;
    }
    .notif-icon.CRITICAL, .notif-icon.HIGH { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); }
    .notif-icon.MEDIUM { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
    .notif-icon.LOW { background: rgba(59, 130, 246, 0.15); color: var(--color-info); }
    
    .notif-content { flex: 1; }
    .notif-content h4 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
    .notif-content p { font-size: 0.9375rem; color: var(--text-secondary); margin-bottom: 8px; }
    .notif-time { font-size: 0.75rem; color: var(--text-muted); }
    .notif-actions { display: flex; gap: 4px; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;

  constructor(private notificationService: NotificationService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load notifications');
        this.loading = false;
      }
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'BUDGET_ALERT': return '⚠️';
      case 'SYSTEM_ALERT': return '⚙️';
      case 'RECURRING_PROCESSED': return '🔄';
      case 'GOAL_ACHIEVED': return '🏆';
      default: return '🔔';
    }
  }

  markRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => this.loadNotifications()
    });
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.toast.success('All notifications marked as read');
        this.loadNotifications();
      }
    });
  }

  deleteNotif(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => this.loadNotifications()
    });
  }
}
