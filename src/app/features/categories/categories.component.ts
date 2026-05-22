import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { Category, CreateCategoryRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize your transactions</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span style="margin-right: 8px;">+</span> Add Category
        </button>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'EXPENSE'" (click)="activeTab = 'EXPENSE'">Expenses</button>
        <button class="tab" [class.active]="activeTab === 'INCOME'" (click)="activeTab = 'INCOME'">Income</button>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading categories...</p>
        </div>
      } @else {
        <div class="grid-4">
          @for (cat of filteredCategories; track cat.categoryId) {
            <div class="card category-card">
              <div class="category-icon" [style.background-color]="cat.colorCode || 'var(--color-primary-glow)'">
                {{ cat.icon || '📁' }}
              </div>
              <div class="category-info">
                <h4>{{ cat.name }}</h4>
                @if (cat.isDefault) {
                  <span class="badge badge-info" style="font-size: 0.6rem;">Default</span>
                }
              </div>
              @if (!cat.isDefault) {
                <button class="btn-icon btn-ghost delete-btn" (click)="deleteCategory(cat.categoryId)" title="Delete">🗑️</button>
              }
            </div>
          }
        </div>
        
        @if (filteredCategories.length === 0) {
          <div class="card empty-state" style="grid-column: 1 / -1;">
            <p>No {{ activeTab.toLowerCase() }} categories found.</p>
          </div>
        }
      }
    </div>

    <!-- Add Category Modal -->
    @if (showAddModal) {
      <div class="modal-backdrop" (click)="closeModal($event)">
        <div class="modal">
          <div class="modal-header">
            <h2>Add {{ activeTab === 'EXPENSE' ? 'Expense' : 'Income' }} Category</h2>
            <button class="btn-icon btn-ghost" (click)="showAddModal = false">✕</button>
          </div>
          <form (ngSubmit)="onAddCategory()">
            <div class="form-group">
              <label class="form-label">Category Name</label>
              <input type="text" class="form-control" [(ngModel)]="newCategory.name" name="name" required placeholder="e.g. Entertainment">
            </div>
            
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Emoji Icon (Optional)</label>
                <input type="text" class="form-control" [(ngModel)]="newCategory.icon" name="icon" placeholder="e.g. 🍿" maxlength="2">
              </div>
              <div class="form-group">
                <label class="form-label">Color Code (Hex)</label>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <input type="color" [(ngModel)]="newCategory.colorCode" name="colorPicker" style="height: 44px; width: 44px; padding: 0; border: none; border-radius: 8px; cursor: pointer;">
                  <input type="text" class="form-control" [(ngModel)]="newCategory.colorCode" name="colorCode" placeholder="#RRGGBB">
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Adding...' : 'Add Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .category-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      position: relative;
    }
    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .category-info h4 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
    .delete-btn { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); opacity: 0; transition: opacity var(--transition-fast); }
    .category-card:hover .delete-btn { opacity: 1; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  activeTab: 'EXPENSE' | 'INCOME' = 'EXPENSE';
  loading = true;
  saving = false;
  showAddModal = false;

  newCategory: CreateCategoryRequest = {
    name: '',
    type: 'EXPENSE',
    icon: '',
    colorCode: '#10b981'
  };

  constructor(private categoryService: CategoryService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getUserCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load categories');
        this.loading = false;
      }
    });
  }

  get filteredCategories(): Category[] {
    return this.categories.filter(c => c.type === this.activeTab);
  }

  onAddCategory(): void {
    if (!this.newCategory.name) {
      this.toast.warning('Category name is required.');
      return;
    }

    this.saving = true;
    this.newCategory.type = this.activeTab;
    
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.toast.success('Category added successfully!');
        this.showAddModal = false;
        this.saving = false;
        this.loadCategories();
        this.newCategory = { name: '', type: 'EXPENSE', icon: '', colorCode: '#10b981' };
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to add category');
        this.saving = false;
      }
    });
  }

  deleteCategory(id: number): void {
    if(confirm('Are you sure you want to delete this category? Any associated transactions might lose their category reference.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toast.success('Category deleted');
          this.loadCategories();
        },
        error: () => this.toast.error('Failed to delete category')
      });
    }
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAddModal = false;
    }
  }
}
