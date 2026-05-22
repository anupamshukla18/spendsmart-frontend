import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { MonthlySummary, FinancialHealthScore, UserResponse } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page animate-in">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {{ user?.fullName?.split(' ')?.[0] || 'User' }}! Here's your financial overview.</p>
        </div>
        <div class="header-actions">
          <select class="form-select month-select" (change)="onMonthChange($event)">
            <option value="0">This Month</option>
            <option value="1">Last Month</option>
            <option value="2">2 Months Ago</option>
          </select>
        </div>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your financial data...</p>
        </div>
      } @else {
        <!-- Key Metrics Cards -->
        <div class="grid-4 metrics-grid">
          <div class="stat-card">
            <div class="stat-label">Total Balance</div>
            <div class="stat-value">{{ (summary?.totalIncome || 0) - (summary?.totalExpenses || 0) | currency:user?.currency:'symbol':'1.0-0' }}</div>
            <div class="stat-change" [class.positive]="summary?.netSavings! > 0" [class.negative]="summary?.netSavings! <= 0">
              {{ summary?.netSavings! > 0 ? '↑' : '↓' }} {{ Math.abs(summary?.netSavings || 0) | currency:user?.currency:'symbol':'1.0-0' }} net
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Total Income</div>
            <div class="stat-value amount-positive">{{ summary?.totalIncome || 0 | currency:user?.currency:'symbol':'1.0-0' }}</div>
            <div class="stat-change text-muted">This month</div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Total Expenses</div>
            <div class="stat-value amount-negative">{{ summary?.totalExpenses || 0 | currency:user?.currency:'symbol':'1.0-0' }}</div>
            <div class="stat-change text-muted">This month</div>
          </div>

          <div class="stat-card">
            <div class="stat-label">Savings Rate</div>
            <div class="stat-value">{{ summary?.savingsRate || 0 | number:'1.0-1' }}%</div>
            <div class="stat-change" [class.positive]="summary?.savingsRate! >= 20" [class.negative]="summary?.savingsRate! < 10">
              Target: 20%
            </div>
          </div>
        </div>

        <div class="grid-2 dashboard-main-grid">
          <!-- Financial Health -->
          <div class="card">
            <div class="card-header">
              <h3>Financial Health Score</h3>
            </div>
            <div class="health-score-container">
              <div class="score-display">
                <div class="score-circle" [class]="getScoreClass(health?.score || 0)">
                  <div class="score-value">{{ health?.score || 0 }}</div>
                </div>
                <div class="score-badge" [class]="getScoreClass(health?.score || 0)">
                  Grade: {{ health?.grade || 'N/A' }}
                </div>
              </div>
              <div class="score-details">
                <div class="score-item">
                  <span class="label">Savings</span>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" [style.width]="(health?.savingsScore || 0) + '%'"></div>
                  </div>
                </div>
                <div class="score-item">
                  <span class="label">Budgeting</span>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" [style.width]="(health?.budgetScore || 0) + '%'"></div>
                  </div>
                </div>
                <div class="score-item">
                  <span class="label">Expenses</span>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" [style.width]="(health?.expenseRatioScore || 0) + '%'"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions / Setup Guide -->
          <div class="card">
            <div class="card-header">
              <h3>Getting Started</h3>
            </div>
            <div class="setup-list">
              <div class="setup-item completed">
                <div class="setup-icon">✓</div>
                <div class="setup-content">
                  <h4>Create Account</h4>
                  <p>Welcome to SpendSmart!</p>
                </div>
              </div>
              <div class="setup-item" [class.completed]="(summary?.totalIncome || 0) > 0">
                <div class="setup-icon">{{ (summary?.totalIncome || 0) > 0 ? '✓' : '2' }}</div>
                <div class="setup-content">
                  <h4>Add your first income</h4>
                  <p>Track where your money comes from.</p>
                </div>
              </div>
              <div class="setup-item" [class.completed]="(summary?.totalExpenses || 0) > 0">
                <div class="setup-icon">{{ (summary?.totalExpenses || 0) > 0 ? '✓' : '3' }}</div>
                <div class="setup-content">
                  <h4>Log an expense</h4>
                  <p>Start tracking your spending habits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page { padding-bottom: 40px; }
    .month-select { width: 160px; }
    .metrics-grid { margin-bottom: 24px; }
    .dashboard-main-grid { margin-bottom: 24px; }
    .card-header { margin-bottom: 20px; }
    .card-header h3 { font-size: 1.125rem; font-weight: 600; }
    
    .health-score-container { display: flex; align-items: center; gap: 32px; }
    .score-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .score-circle {
      width: 120px; height: 120px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--bg-elevated);
      border: 8px solid var(--border-light);
      box-shadow: inset 0 4px 10px rgba(0,0,0,0.2);
    }
    .score-circle.excellent { border-color: var(--color-success); color: var(--color-success); box-shadow: 0 0 20px rgba(16,185,129,0.2); }
    .score-circle.good { border-color: var(--color-info); color: var(--color-info); box-shadow: 0 0 20px rgba(59,130,246,0.2); }
    .score-circle.fair { border-color: var(--color-warning); color: var(--color-warning); box-shadow: 0 0 20px rgba(245,158,11,0.2); }
    .score-circle.poor { border-color: var(--color-danger); color: var(--color-danger); box-shadow: 0 0 20px rgba(239,68,68,0.2); }
    .score-value { font-size: 2.5rem; font-weight: 800; line-height: 1; margin: 0; padding: 0; }
    
    .score-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      white-space: nowrap;
    }
    .score-badge.excellent { background: rgba(16, 185, 129, 0.15); color: var(--color-success); border-color: rgba(16, 185, 129, 0.3); }
    .score-badge.good { background: rgba(59, 130, 246, 0.15); color: var(--color-info); border-color: rgba(59, 130, 246, 0.3); }
    .score-badge.fair { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); border-color: rgba(245, 158, 11, 0.3); }
    .score-badge.poor { background: rgba(239, 68, 68, 0.15); color: var(--color-danger); border-color: rgba(239, 68, 68, 0.3); }
    
    .score-details { flex: 1; display: flex; flex-direction: column; gap: 16px; }
    .score-item .label { display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 6px; }
    
    .setup-list { display: flex; flex-direction: column; gap: 16px; }
    .setup-item { display: flex; align-items: flex-start; gap: 16px; padding: 12px; border-radius: var(--radius-md); background: var(--bg-elevated); border: 1px solid var(--border-subtle); transition: all 0.2s; }
    .setup-item.completed { opacity: 0.7; border-color: var(--color-primary-glow); }
    .setup-item.completed .setup-icon { background: var(--color-success); color: white; border-color: var(--color-success); }
    .setup-icon { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--text-muted); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--text-muted); font-size: 0.875rem; }
    .setup-content h4 { font-size: 0.9375rem; margin-bottom: 4px; }
    .setup-content p { font-size: 0.8125rem; color: var(--text-muted); }
    
    .loading-state { text-align: center; padding: 60px 20px; }
    .loading-state p { margin-top: 16px; color: var(--text-muted); }
    
    @media (max-width: 768px) {
      .health-score-container { flex-direction: column; gap: 24px; }
      .score-details { width: 100%; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  Math = Math;
  user: UserResponse | null = null;
  summary: MonthlySummary | null = null;
  health: FinancialHealthScore | null = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.loadData(new Date());
  }

  loadData(date: Date): void {
    this.loading = true;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.analyticsService.getMonthlySummary(month, year).subscribe({
      next: (res) => {
        this.summary = res.data;
        this.loadHealthScore();
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load dashboard summary');
      }
    });
  }

  loadHealthScore(): void {
    this.analyticsService.getHealthScore().subscribe({
      next: (res) => {
        this.health = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load your financial health score');
      }
    });
  }

  onMonthChange(event: any): void {
    const monthsAgo = parseInt(event.target.value, 10);
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    this.loadData(date);
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }
}
