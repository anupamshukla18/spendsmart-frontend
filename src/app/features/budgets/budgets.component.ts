import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { BudgetService } from '../../core/services/budget.service';
import { ToastService } from '../../core/services/toast.service';
import { CategoryService } from '../../core/services/category.service';
import { BudgetProgress, CreateBudgetRequest, Category } from '../../core/models/api.models';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Control your spending with custom limits</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span style="margin-right: 8px;">+</span> Create Budget
        </button>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your budgets...</p>
        </div>
      } @else if (budgets.length === 0) {
        <div class="card empty-state">
          <div class="empty-state-icon">🎯</div>
          <h3>No budgets set up</h3>
          <p>Create a budget to start tracking your spending limits.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="showAddModal = true">Create Your First Budget</button>
        </div>
      } @else {
        <div class="grid-2">
          @for (b of budgets; track b.budgetId) {
            <div class="card budget-card" [class.exceeded]="b.limitExceeded" [class.warning]="b.thresholdReached && !b.limitExceeded">
              <div class="budget-header">
                <div>
                  <h3 class="budget-title">{{ b.name }}</h3>
                  <p class="budget-period">{{ b.period }} ({{ b.startDate | date:'shortDate' }} - {{ b.endDate | date:'shortDate' }})</p>
                </div>
                <button class="btn-icon btn-ghost" (click)="deleteBudget(b.budgetId)" title="Delete">🗑️</button>
              </div>

              <div class="budget-amounts">
                <span class="spent" [class.danger]="b.limitExceeded">
                  {{ b.spentAmount | currency:userCurrency:'symbol':'1.0-0' }}
                </span>
                <span class="limit">of {{ b.limitAmount | currency:userCurrency:'symbol':'1.0-0' }}</span>
              </div>

              <div class="progress-bar-container">
                <div class="progress-bar">
                  <div class="progress-bar-fill" 
                       [style.width]="Math.min(b.percentageUsed, 100) + '%'"
                       [class.warning]="b.thresholdReached && !b.limitExceeded"
                       [class.danger]="b.limitExceeded">
                  </div>
                </div>
                <div class="progress-stats">
                  <span>{{ b.percentageUsed | number:'1.0-1' }}% Used</span>
                  <span>{{ b.remainingAmount > 0 ? (b.remainingAmount | currency:userCurrency:'symbol':'1.0-0') + ' left' : 'Over budget by ' + (Math.abs(b.remainingAmount) | currency:userCurrency:'symbol':'1.0-0') }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Add Budget Modal -->
    @if (showAddModal) {
      <div class="modal-backdrop" (click)="closeModal($event)">
        <div class="modal">
          <div class="modal-header">
            <h2>Create Budget</h2>
            <button class="btn-icon btn-ghost" (click)="showAddModal = false">✕</button>
          </div>
          <form (ngSubmit)="onCreateBudget()">
            <div class="form-group">
              <label class="form-label">Budget Name</label>
              <input type="text" class="form-control" [(ngModel)]="newBudget.name" name="name" required placeholder="e.g. Monthly Groceries">
            </div>
            
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Limit Amount</label>
                <input type="number" class="form-control" [(ngModel)]="newBudget.limitAmount" name="limitAmount" required min="1">
              </div>
              <div class="form-group">
                <label class="form-label">Category (Optional)</label>
                <select class="form-select" [(ngModel)]="newBudget.categoryId" name="categoryId">
                  <option [ngValue]="null">Overall Budget</option>
                  @for (cat of categories; track cat.categoryId) {
                    <option [ngValue]="cat.categoryId">{{ cat.icon ? cat.icon + ' ' : '' }}{{ cat.name }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" [(ngModel)]="newBudget.startDate" name="startDate" required>
              </div>
              <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="date" class="form-control" [(ngModel)]="newBudget.endDate" name="endDate" required>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Period Type</label>
                <select class="form-select" [(ngModel)]="newBudget.period" name="period">
                  <option value="MONTHLY">Monthly</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Alert Threshold (%)</label>
                <input type="number" class="form-control" [(ngModel)]="newBudget.alertThreshold" name="alertThreshold" min="1" max="100">
                <small class="form-error" style="color: var(--text-muted);">Notify me when I spend this much</small>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Creating...' : 'Create Budget' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .budget-card {
      transition: all var(--transition-base);
    }
    .budget-card.warning { border-color: var(--color-warning); box-shadow: 0 0 10px rgba(245, 158, 11, 0.1); }
    .budget-card.exceeded { border-color: var(--color-danger); box-shadow: 0 0 10px rgba(239, 68, 68, 0.1); }
    
    .budget-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .budget-title { font-size: 1.125rem; font-weight: 700; margin-bottom: 4px; }
    .budget-period { font-size: 0.8125rem; color: var(--text-muted); }
    
    .budget-amounts { margin-bottom: 16px; }
    .spent { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); }
    .spent.danger { color: var(--color-danger); }
    .limit { font-size: 1rem; color: var(--text-muted); margin-left: 8px; }
    
    .progress-bar-container { width: 100%; }
    .progress-stats { display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
  `]
})
export class BudgetsComponent implements OnInit {
  Math = Math;
  budgets: BudgetProgress[] = [];
  categories: Category[] = [];
  userCurrency = 'INR';
  loading = true;
  saving = false;
  showAddModal = false;

  newBudget: CreateBudgetRequest = {
    name: '',
    limitAmount: 0,
    categoryId: undefined,
    period: 'MONTHLY',
    startDate: this.getFirstDayOfMonth(),
    endDate: this.getLastDayOfMonth(),
    alertThreshold: 80
  };

  constructor(
    private authService: AuthService,
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userCurrency = user?.currency || 'INR';
      this.newBudget.currency = this.userCurrency;
    });
    this.loadCategories();
    this.loadBudgets();
  }

  loadCategories(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (res) => this.categories = res.data || [],
      error: () => this.toast.error('Failed to load categories')
    });
  }

  loadBudgets(): void {
    this.loading = true;
    // We get the active budgets and then we'd ideally get progress for each.
    // For now, let's just fetch all budgets. The backend handles returning full list, we map them to progress endpoints.
    this.budgetService.getUserBudgets().subscribe({
      next: (res) => {
        const budgetsList = res.data || [];
        this.budgets = [];
        
        if (budgetsList.length === 0) {
          this.loading = false;
          return;
        }

        let loadedCount = 0;
        budgetsList.forEach(b => {
          this.budgetService.getBudgetProgress(b.budgetId).subscribe({
            next: (prog) => {
              if (prog.data) this.budgets.push(prog.data);
              loadedCount++;
              if (loadedCount === budgetsList.length) this.loading = false;
            },
            error: () => {
              loadedCount++;
              if (loadedCount === budgetsList.length) this.loading = false;
            }
          });
        });
      },
      error: () => {
        this.toast.error('Failed to load budgets');
        this.loading = false;
      }
    });
  }

  onCreateBudget(): void {
    if (!this.newBudget.name || this.newBudget.limitAmount <= 0 || !this.newBudget.startDate || !this.newBudget.endDate) {
      this.toast.warning('Please fill out all required fields.');
      return;
    }

    this.saving = true;
    this.newBudget.currency = this.userCurrency;
    
    // Ensure format
    if (this.newBudget.startDate.includes('T')) this.newBudget.startDate = this.newBudget.startDate.split('T')[0];
    if (this.newBudget.endDate.includes('T')) this.newBudget.endDate = this.newBudget.endDate.split('T')[0];

    this.budgetService.createBudget(this.newBudget).subscribe({
      next: () => {
        this.toast.success('Budget created successfully!');
        this.showAddModal = false;
        this.saving = false;
        this.loadBudgets();
        this.resetForm();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to create budget');
        this.saving = false;
      }
    });
  }

  deleteBudget(id: number): void {
    if(confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(id).subscribe({
        next: () => {
          this.toast.success('Budget deleted');
          this.loadBudgets();
        },
        error: () => this.toast.error('Failed to delete budget')
      });
    }
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAddModal = false;
    }
  }

  getFirstDayOfMonth(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  }

  getLastDayOfMonth(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  resetForm(): void {
    this.newBudget = {
      name: '',
      limitAmount: 0,
      categoryId: undefined,
      currency: this.userCurrency,
      period: 'MONTHLY',
      startDate: this.getFirstDayOfMonth(),
      endDate: this.getLastDayOfMonth(),
      alertThreshold: 80
    };
  }
}
