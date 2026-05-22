import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { IncomeService } from '../../core/services/income.service';
import { CategoryService } from '../../core/services/category.service';
import { PaymentOption, PaymentService } from '../../core/services/payment.service';
import { ToastService } from '../../core/services/toast.service';
import { Income, Category, CreateIncomeRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Income</h1>
          <p>Manage your revenue streams</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span style="margin-right: 8px;">+</span> Add Income
        </button>
      </div>

      <div class="card search-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="searchKeyword" (ngModelChange)="onSearch()" placeholder="Search income by title or notes...">
        </div>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading income records...</p>
        </div>
      } @else if (incomes.length === 0) {
        <div class="card empty-state">
          <div class="empty-state-icon">💰</div>
          <h3>No income found</h3>
          <p>You haven't recorded any income yet or none match your search.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="showAddModal = true">Record Your First Income</button>
        </div>
      } @else {
        <div class="card table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Payment Method</th>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (inc of incomes; track inc.incomeId) {
                <tr>
                  <td>{{ inc.date | date:'mediumDate' }}</td>
                  <td>
                    <strong>{{ inc.title }}</strong>
                    @if(inc.notes) { <div style="font-size: 0.75rem; color: var(--text-muted);">{{ inc.notes }}</div> }
                  </td>
                  <td>{{ getPaymentMethodLabel(inc.paymentMethod) }}</td>
                  <td>
                    <span class="badge badge-success">
                      {{ getCategoryName(inc.categoryId) }}
                    </span>
                  </td>
                  <td style="text-align: right; font-weight: 600;" class="amount-positive">
                    +{{ inc.amount | currency:inc.currency:'symbol':'1.2-2' }}
                  </td>
                  <td style="text-align: center;">
                    <button class="btn-icon btn-ghost" (click)="deleteIncome(inc.incomeId)" title="Delete">🗑️</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Add Income Modal -->
    @if (showAddModal) {
      <div class="modal-backdrop" (click)="closeModal($event)">
        <div class="modal">
          <div class="modal-header">
            <h2>Add Income</h2>
            <button class="btn-icon btn-ghost" (click)="showAddModal = false">✕</button>
          </div>
          <form (ngSubmit)="onAddIncome()">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" [(ngModel)]="newIncome.title" name="title" required placeholder="e.g. Monthly Salary">
            </div>
            
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-control" [(ngModel)]="newIncome.amount" name="amount" required min="0.01" step="0.01">
              </div>
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" [(ngModel)]="newIncome.date" name="date" required>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" [(ngModel)]="newIncome.categoryId" name="categoryId" required>
                  <option value="0" disabled>Select a category</option>
                  @for (cat of categories; track cat.categoryId) {
                    <option [value]="cat.categoryId">{{ cat.icon ? cat.icon + ' ' : '' }}{{ cat.name }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select class="form-select" [(ngModel)]="newIncome.paymentMethod" name="paymentMethod">
                  @for (option of paymentOptions; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Notes (Optional)</label>
              <textarea class="form-control" [(ngModel)]="newIncome.notes" name="notes" rows="2" placeholder="Any additional details..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save Income' }}
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
export class IncomeComponent implements OnInit {
  incomes: Income[] = [];
  categories: Category[] = [];
  paymentOptions: PaymentOption[] = [];
  loading = true;
  saving = false;
  showAddModal = false;
  searchKeyword = '';
  userCurrency = 'INR';

  newIncome: CreateIncomeRequest = {
    title: '',
    amount: 0,
    categoryId: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'CARD',
    currency: 'INR',
    notes: ''
  };

  private searchTimeout: any;

  constructor(
    private authService: AuthService,
    private incomeService: IncomeService,
    private categoryService: CategoryService,
    private paymentService: PaymentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.paymentOptions = this.paymentService.getIncomeOptions();
    this.authService.currentUser$.subscribe(user => {
      this.userCurrency = user?.currency || 'INR';
      this.newIncome.currency = this.userCurrency;
    });
    this.loadCategories();
    this.loadIncomes();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesByType('INCOME').subscribe({
      next: (res) => {
        console.log('Income categories response:', res);
        this.categories = res.data || [];
        console.log('Income categories loaded:', this.categories.length, this.categories);
        if (this.categories.length === 0) {
          this.toast.warning('No income categories found. Please contact support or try refreshing.');
        }
      },
      error: (err) => {
        this.toast.error('Failed to load categories');
        console.error('Category load error:', err);
      }
    });
  }

  loadIncomes(): void {
    this.loading = true;
    this.incomeService.getUserIncomes().subscribe({
      next: (res) => {
        this.incomes = res.data || [];
        this.incomes = this.incomes.map(income => ({
          ...income,
          paymentMethod: this.paymentService.normalize(income.paymentMethod)
        }));
        this.incomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load income records');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      if (!this.searchKeyword.trim()) {
        this.loadIncomes();
        return;
      }
      
      this.loading = true;
      this.incomeService.searchIncomes(this.searchKeyword).subscribe({
        next: (res) => {
          this.incomes = res.data || [];
          this.incomes = this.incomes.map(income => ({
            ...income,
            paymentMethod: this.paymentService.normalize(income.paymentMethod)
          }));
          this.loading = false;
        },
        error: () => {
          this.toast.error('Failed to search income records');
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

  onAddIncome(): void {
    if (!this.newIncome.title || this.newIncome.amount <= 0 || !this.newIncome.categoryId) {
      this.toast.warning('Please fill out all required fields correctly.');
      return;
    }

    this.saving = true;
    this.newIncome.paymentMethod = this.paymentService.normalize(this.newIncome.paymentMethod);
    this.newIncome.currency = this.userCurrency;
    
    if (this.newIncome.date.includes('T')) {
       this.newIncome.date = this.newIncome.date.split('T')[0];
    }
    
    this.incomeService.addIncome(this.newIncome).subscribe({
      next: () => {
        this.toast.success('Income recorded successfully!');
        this.showAddModal = false;
        this.saving = false;
        this.resetForm();
        this.loadIncomes();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to record income');
        this.saving = false;
      }
    });
  }

  deleteIncome(id: number): void {
    if(confirm('Are you sure you want to delete this income record?')) {
      this.incomeService.deleteIncome(id).subscribe({
        next: () => {
          this.toast.success('Income record deleted');
          this.loadIncomes();
        },
        error: () => this.toast.error('Failed to delete income')
      });
    }
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAddModal = false;
    }
  }

  resetForm(): void {
    this.newIncome = {
      title: '',
      amount: 0,
      categoryId: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CARD',
      currency: this.userCurrency,
      notes: ''
    };
  }
}
