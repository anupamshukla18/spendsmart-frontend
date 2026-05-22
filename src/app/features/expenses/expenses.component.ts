import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ExpenseService } from '../../core/services/expense.service';
import { CategoryService } from '../../core/services/category.service';
import { PaymentOption, PaymentService } from '../../core/services/payment.service';
import { ToastService } from '../../core/services/toast.service';
import { Expense, Category, CreateExpenseRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Track and manage your outgoing money</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span style="margin-right: 8px;">+</span> Add Expense
        </button>
      </div>

      <div class="card search-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="searchKeyword" (ngModelChange)="onSearch()" placeholder="Search expenses by title or notes...">
        </div>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading expenses...</p>
        </div>
      } @else if (expenses.length === 0) {
        <div class="card empty-state">
          <div class="empty-state-icon">💸</div>
          <h3>No expenses found</h3>
          <p>You haven't recorded any expenses yet or none match your search.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="showAddModal = true">Add Your First Expense</button>
        </div>
      } @else {
        <div class="card table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (exp of expenses; track exp.expenseId) {
                <tr>
                  <td>{{ exp.expenseDate | date:'mediumDate' }}</td>
                  <td>
                    <strong>{{ exp.title }}</strong>
                    @if(exp.notes) { <div style="font-size: 0.75rem; color: var(--text-muted);">{{ exp.notes }}</div> }
                  </td>
                  <td>
                    <span class="badge" style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary);">
                      {{ getCategoryName(exp.categoryId) }}
                    </span>
                  </td>
                  <td>{{ getPaymentMethodLabel(exp.paymentMethod) }}</td>
                  <td style="text-align: right; font-weight: 600;" class="amount-negative">
                    -{{ exp.amount | currency:exp.currency:'symbol':'1.2-2' }}
                  </td>
                  <td style="text-align: center;">
                    <button class="btn-icon btn-ghost" (click)="deleteExpense(exp.expenseId)" title="Delete">🗑️</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Add Expense Modal -->
    @if (showAddModal) {
      <div class="modal-backdrop" (click)="closeModal($event)">
        <div class="modal">
          <div class="modal-header">
            <h2>Add Expense</h2>
            <button class="btn-icon btn-ghost" (click)="showAddModal = false">✕</button>
          </div>
          <form (ngSubmit)="onAddExpense()">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" [(ngModel)]="newExpense.title" name="title" required placeholder="e.g. Groceries">
            </div>
            
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-control" [(ngModel)]="newExpense.amount" name="amount" required min="0.01" step="0.01">
              </div>
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" [(ngModel)]="newExpense.expenseDate" name="expenseDate" required>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="newExpense.categoryId" name="categoryId" required>
                  <option value="0" disabled>Select a category</option>
                  @for (cat of categories; track cat.categoryId) {
                    <option [value]="cat.categoryId">{{ cat.icon ? cat.icon + ' ' : '' }}{{ cat.name }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select class="form-select" [(ngModel)]="newExpense.paymentMethod" name="paymentMethod">
                  @for (option of paymentOptions; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Notes (Optional)</label>
              <textarea class="form-control" [(ngModel)]="newExpense.notes" name="notes" rows="2" placeholder="Any additional details..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save Expense' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .search-card { margin-bottom: 24px; padding: 16px; }
    .loading-state { text-align: center; padding: 40px; }
  `]
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  paymentOptions: PaymentOption[] = [];
  loading = true;
  saving = false;
  showAddModal = false;
  searchKeyword = '';
  userCurrency = 'INR';

  newExpense: CreateExpenseRequest = {
    title: '',
    amount: 0,
    categoryId: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CARD',
    type: 'EXPENSE',
    currency: 'INR',
    notes: ''
  };

  private searchTimeout: any;

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private paymentService: PaymentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.paymentOptions = this.paymentService.getExpenseOptions();
    this.authService.currentUser$.subscribe(user => {
      this.userCurrency = user?.currency || 'INR';
      this.newExpense.currency = this.userCurrency;
    });
    this.loadCategories();
    this.loadExpenses();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesByType('EXPENSE').subscribe({
      next: (res) => {
        console.log('Categories response:', res);
        this.categories = res.data || [];
        console.log('Categories loaded:', this.categories.length, this.categories);
        if (this.categories.length === 0) {
          this.toast.warning('No expense categories found. Please contact support or try refreshing.');
        }
      },
      error: (err) => {
        this.toast.error('Failed to load categories');
        console.error('Category load error:', err);
      }
    });
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getUserExpenses().subscribe({
      next: (res) => {
        this.expenses = res.data || [];
        this.expenses = this.expenses.map(expense => ({
          ...expense,
          paymentMethod: this.paymentService.normalize(expense.paymentMethod)
        }));
        // Sort descending by date
        this.expenses.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime());
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load expenses');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      if (!this.searchKeyword.trim()) {
        this.loadExpenses();
        return;
      }
      
      this.loading = true;
      this.expenseService.searchExpenses(this.searchKeyword).subscribe({
        next: (res) => {
          this.expenses = res.data || [];
          this.expenses = this.expenses.map(expense => ({
            ...expense,
            paymentMethod: this.paymentService.normalize(expense.paymentMethod)
          }));
          this.loading = false;
        },
        error: () => {
          this.toast.error('Failed to search expenses');
          this.loading = false;
        }
      });
    }, 300);
  }

  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.categoryId === id);
    return cat ? cat.name : 'Unknown';
  }

  getPaymentMethodLabel(method: string): string {
    return this.paymentService.getLabel(method);
  }

  onAddExpense(): void {
    if (!this.newExpense.title || this.newExpense.amount <= 0 || !this.newExpense.categoryId) {
      this.toast.warning('Please fill out all required fields correctly.');
      return;
    }

    this.saving = true;
    this.newExpense.paymentMethod = this.paymentService.normalize(this.newExpense.paymentMethod);
    this.newExpense.currency = this.userCurrency;
    
    // Ensure date format is correct
    if (this.newExpense.expenseDate.includes('T')) {
       this.newExpense.expenseDate = this.newExpense.expenseDate.split('T')[0];
    }
    
    this.expenseService.addExpense(this.newExpense).subscribe({
      next: () => {
        this.toast.success('Expense added successfully!');
        this.showAddModal = false;
        this.saving = false;
        this.resetForm();
        this.loadExpenses();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to add expense');
        this.saving = false;
      }
    });
  }

  deleteExpense(id: number): void {
    if(confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.toast.success('Expense deleted');
          this.loadExpenses();
        },
        error: () => this.toast.error('Failed to delete expense')
      });
    }
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAddModal = false;
    }
  }

  resetForm(): void {
    this.newExpense = {
      title: '',
      amount: 0,
      categoryId: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CARD',
      type: 'EXPENSE',
      currency: this.userCurrency,
      notes: ''
    };
  }
}
