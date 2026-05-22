import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecurringService } from '../../core/services/recurring.service';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { RecurringTransaction, Category, CreateRecurringRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-recurring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Recurring Transactions</h1>
          <p>Automate your subscriptions and fixed incomes</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span style="margin-right: 8px;">+</span> New Rule
        </button>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading rules...</p>
        </div>
      } @else if (rules.length === 0) {
        <div class="card empty-state">
          <div class="empty-state-icon">🔄</div>
          <h3>No recurring transactions</h3>
          <p>Set up rules to automatically track your subscriptions, rent, or salary.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="showAddModal = true">Create First Rule</button>
        </div>
      } @else {
        <div class="grid-3">
          @for (rule of rules; track rule.recurringId) {
            <div class="card" [class.inactive]="!rule.isActive">
              <div class="rule-header">
                <span class="badge" [class.badge-success]="rule.type === 'INCOME'" [class.badge-danger]="rule.type === 'EXPENSE'">
                  {{ rule.type }}
                </span>
                <span class="badge badge-info">{{ rule.frequency }}</span>
              </div>
              <h3 class="rule-title">{{ rule.title }}</h3>
              <div class="rule-amount" [class.amount-positive]="rule.type === 'INCOME'" [class.amount-negative]="rule.type === 'EXPENSE'">
                {{ rule.type === 'INCOME' ? '+' : '-' }}{{ rule.amount | currency:rule.currency:'symbol':'1.0-0' }}
              </div>
              <p class="rule-date">Next due: <strong>{{ rule.nextDueDate | date:'mediumDate' }}</strong></p>
              
              <div class="rule-actions">
                @if (rule.isActive) {
                  <button class="btn btn-sm btn-secondary" (click)="deactivateRule(rule.recurringId)">Deactivate</button>
                } @else {
                  <span class="text-muted" style="font-size: 0.8125rem;">Inactive</span>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>

    @if (showAddModal) {
      <div class="modal-backdrop" (click)="closeModal($event)">
        <div class="modal">
          <div class="modal-header">
            <h2>Add Recurring Transaction</h2>
            <button class="btn-icon btn-ghost" (click)="showAddModal = false">✕</button>
          </div>
          <form (ngSubmit)="onAddRule()">
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select class="form-select" [(ngModel)]="newRule.type" name="type" (change)="loadCategories()">
                  <option value="EXPENSE">Expense (e.g. Netflix, Rent)</option>
                  <option value="INCOME">Income (e.g. Salary)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="newRule.categoryId" name="categoryId" required>
                  <option value="0" disabled>Select category</option>
                  @for (cat of categories; track cat.categoryId) {
                    <option [value]="cat.categoryId">{{ cat.icon ? cat.icon + ' ' : '' }}{{ cat.name }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" [(ngModel)]="newRule.title" name="title" required placeholder="e.g. Netflix Subscription">
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-control" [(ngModel)]="newRule.amount" name="amount" required min="0.01">
              </div>
              <div class="form-group">
                <label class="form-label">Frequency</label>
                <select class="form-select" [(ngModel)]="newRule.frequency" name="frequency">
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" [(ngModel)]="newRule.startDate" name="startDate" required>
              </div>
              <div class="form-group">
                <label class="form-label">End Date (Optional)</label>
                <input type="date" class="form-control" [(ngModel)]="newRule.endDate" name="endDate">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save Rule' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .rule-header { display: flex; gap: 8px; margin-bottom: 12px; }
    .rule-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; }
    .rule-amount { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; }
    .rule-date { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 20px; }
    .rule-actions { border-top: 1px solid var(--border-subtle); padding-top: 16px; display: flex; justify-content: flex-end; }
    .inactive { opacity: 0.6; filter: grayscale(50%); }
  `]
})
export class RecurringComponent implements OnInit {
  rules: RecurringTransaction[] = [];
  categories: Category[] = [];
  loading = true;
  saving = false;
  showAddModal = false;

  newRule: CreateRecurringRequest = {
    title: '',
    amount: 0,
    categoryId: 0,
    type: 'EXPENSE',
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0]
  };

  constructor(
    private recurringService: RecurringService,
    private categoryService: CategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadRules();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesByType(this.newRule.type).subscribe({
      next: (res) => this.categories = res.data || []
    });
  }

  loadRules(): void {
    this.loading = true;
    this.recurringService.getUserRecurring().subscribe({
      next: (res) => {
        this.rules = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load recurring rules');
        this.loading = false;
      }
    });
  }

  onAddRule(): void {
    if (!this.newRule.title || this.newRule.amount <= 0 || !this.newRule.categoryId) {
      this.toast.warning('Please complete the form correctly.');
      return;
    }

    this.saving = true;
    if (this.newRule.startDate.includes('T')) this.newRule.startDate = this.newRule.startDate.split('T')[0];
    if (this.newRule.endDate && this.newRule.endDate.includes('T')) this.newRule.endDate = this.newRule.endDate.split('T')[0];

    this.recurringService.createRecurring(this.newRule).subscribe({
      next: () => {
        this.toast.success('Recurring rule created successfully');
        this.showAddModal = false;
        this.saving = false;
        this.loadRules();
        this.newRule = {
          title: '', amount: 0, categoryId: 0, type: 'EXPENSE', frequency: 'MONTHLY',
          startDate: new Date().toISOString().split('T')[0]
        };
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to create rule');
        this.saving = false;
      }
    });
  }

  deactivateRule(id: number): void {
    if(confirm('Are you sure you want to deactivate this rule? It will stop generating automatic transactions.')) {
      this.recurringService.deactivateRecurring(id).subscribe({
        next: () => {
          this.toast.success('Rule deactivated');
          this.loadRules();
        },
        error: () => this.toast.error('Failed to deactivate rule')
      });
    }
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAddModal = false;
    }
  }
}
