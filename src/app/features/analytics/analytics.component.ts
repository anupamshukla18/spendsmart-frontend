import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ExpenseService } from '../../core/services/expense.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-in">
      <div class="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Deep dive into your financial data</p>
        </div>
      </div>

      <!-- Premium KPI Dashboard Summary Metrics -->
      <div class="grid-4" style="margin-bottom: 24px;" *ngIf="summary">
        <div class="stat-card">
          <div class="stat-label">Total Monthly Income</div>
          <div class="stat-value" style="color: var(--color-success)">
            ₹{{ (summary.totalIncome || 0) | number:'1.2-2' }}
          </div>
          <div class="stat-change positive">
            <span>Period: {{ summary.period }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Total Monthly Expenses</div>
          <div class="stat-value" style="color: var(--color-danger)">
            ₹{{ (summary.totalExpenses || 0) | number:'1.2-2' }}
          </div>
          <div class="stat-change negative">
            <span>Period: {{ summary.period }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Net Monthly Savings</div>
          <div class="stat-value" [style.color]="(summary.netSavings || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)'">
            ₹{{ (summary.netSavings || 0) | number:'1.2-2' }}
          </div>
          <div class="stat-change" [class.positive]="(summary.netSavings || 0) >= 0" [class.negative]="(summary.netSavings || 0) < 0">
            <span>{{ (summary.netSavings || 0) >= 0 ? 'Surplus' : 'Deficit' }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Savings Rate</div>
          <div class="stat-value" style="color: var(--color-info)">
            {{ (summary.savingsRate || 0) | number:'1.1-1' }}%
          </div>
          <div class="progress-bar" style="margin-top: 8px;">
            <div class="progress-bar-fill" [style.width.%]="summary.savingsRate || 0" [class.danger]="(summary.savingsRate || 0) < 10" [class.warning]="(summary.savingsRate || 0) >= 10 && (summary.savingsRate || 0) < 20"></div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3>Income vs Expenses (Last 6 Months)</h3>
          </div>
          <div class="chart-container">
            <canvas #incomeExpenseChart></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Top Expense Categories (This Month)</h3>
          </div>
          <div class="chart-container">
            <canvas #categoryPieChart></canvas>
          </div>
        </div>
      </div>
      
      <div class="grid-2" style="margin-top: 24px;">
        <div class="card">
          <div class="card-header">
            <h3>Spending Trend (This Month)</h3>
          </div>
          <div class="chart-container">
            <canvas #trendChart></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>High-Value Expenses (This Month)</h3>
          </div>
          <div style="margin-top: 16px;">
            <div class="table-container" *ngIf="expenses && expenses.length > 0; else noExpenses">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let exp of topExpenses">
                    <td style="font-weight: 600;">{{ exp.title }}</td>
                    <td>
                      <span class="chip">{{ getCategoryName(exp.categoryId) }}</span>
                    </td>
                    <td>{{ exp.expenseDate }}</td>
                    <td style="text-align: right; font-weight: 700; color: var(--color-danger)">
                      ₹{{ exp.amount | number:'1.2-2' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #noExpenses>
              <div class="empty-state">
                <div class="empty-state-icon">💸</div>
                <h3>No expenses found for this month</h3>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }
  `]
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('incomeExpenseChart') incomeExpenseCanvas!: ElementRef;
  @ViewChild('categoryPieChart') categoryPieCanvas!: ElementRef;
  @ViewChild('trendChart') trendCanvas!: ElementRef;

  incExpChartInstance: any;
  catPieChartInstance: any;
  trendChartInstance: any;

  summary: any = null;
  expenses: any[] = [];
  catIdToNameMap = new Map<number, string>();

  constructor(
    private analyticsService: AnalyticsService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadIncomeVsExpense();
    this.loadCategoryBreakdown();
    this.loadMonthlyIncomeVsExpensePie();
    this.loadTrend();
  }

  get topExpenses(): any[] {
    return [...this.expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  getCategoryName(catId: number): string {
    return this.catIdToNameMap.get(catId) || 'Other';
  }

  loadIncomeVsExpense(): void {
    const today = new Date();
    this.analyticsService.getIncomeVsExpense(today.getMonth() + 1, today.getFullYear()).subscribe(res => {
       if(!res.data || res.data.length === 0) return;
       
       const labels = res.data.map(d => d.label);
       const incomeData = res.data.map(d => d.income);
       const expenseData = res.data.map(d => d.expenses);

       if (this.incExpChartInstance) this.incExpChartInstance.destroy();
       
       this.incExpChartInstance = new Chart(this.incomeExpenseCanvas.nativeElement, {
         type: 'bar',
         data: {
           labels: labels,
           datasets: [
             { label: 'Income', data: incomeData, backgroundColor: '#10b981', borderRadius: 4 },
             { label: 'Expenses', data: expenseData, backgroundColor: '#ef4444', borderRadius: 4 }
           ]
         },
         options: {
           responsive: true,
           maintainAspectRatio: false,
           plugins: { legend: { labels: { color: '#94a3b8' } } },
           scales: {
             y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
             x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
           }
         }
       });
     });
  }

  loadCategoryBreakdown(): void {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];

    // Load monthly expenses first
    this.expenseService.getExpensesByMonth(d.getMonth() + 1, d.getFullYear()).subscribe(expenseRes => {
      this.expenses = expenseRes.data || [];

      // Then load category breakdown chart
      this.analyticsService.getCategoryBreakdown(start, end).subscribe(res => {
        if(!res.data || res.data.length === 0) return;

        // Build category ID to name map
        this.catIdToNameMap.clear();
        res.data.forEach((item: any) => {
          this.catIdToNameMap.set(item.categoryId, item.categoryName);
        });

        const labels = res.data.map(d => d.categoryName);
        const data = res.data.map(d => d.amount);
        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

        if (this.catPieChartInstance) this.catPieChartInstance.destroy();

        this.catPieChartInstance = new Chart(this.categoryPieCanvas.nativeElement, {
           type: 'doughnut',
           data: {
             labels: labels,
             datasets: [{
               data: data,
               backgroundColor: colors,
               borderWidth: 0,
               hoverOffset: 4
             }]
           },
           options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: { 
               legend: { position: 'right', labels: { color: '#94a3b8' } },
               tooltip: {
                 callbacks: {
                   label: (context: any) => {
                     const label = context.label || '';
                     const value = context.parsed || 0;
                     // Filter expenses belonging to this category label
                     const matching = this.expenses.filter((e: any) => {
                       const name = this.catIdToNameMap.get(e.categoryId);
                       return name === label;
                     });
                     if (matching.length > 0) {
                       const details = matching.map((e: any) => `${e.title}: ₹${e.amount.toLocaleString()}`).join(', ');
                       return ` ${label}: ₹${value.toLocaleString()} (${details})`;
                     }
                     return ` ${label}: ₹${value.toLocaleString()}`;
                   }
                 }
               }
             },
             cutout: '70%'
           }
         });
      });
    });
  }

  loadMonthlyIncomeVsExpensePie(): void {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    this.analyticsService.getMonthlySummary(month, year).subscribe(res => {
      if (res && res.data) {
        this.summary = res.data;
      }
    });
  }
  
  loadTrend(): void {
    const today = new Date();
    this.analyticsService.getDailyTrend(today.getMonth() + 1, today.getFullYear()).subscribe(res => {
       if(!res.data || res.data.length === 0) return;
       
       const labels = res.data.map(d => {
         const parts = d.date.split('-');
         return parts.length === 3 ? `${parts[2]}/${parts[1]}` : d.date;
       });
       const data = res.data.map(d => d.cumulativeAmount);

       if (this.trendChartInstance) this.trendChartInstance.destroy();
       
       this.trendChartInstance = new Chart(this.trendCanvas.nativeElement, {
         type: 'line',
         data: {
           labels: labels,
           datasets: [
             { 
               label: 'Cumulative Spending', 
               data: data, 
               borderColor: '#f59e0b', 
               backgroundColor: 'rgba(245, 158, 11, 0.1)',
               fill: true,
               tension: 0.4
             }
           ]
         },
         options: {
           responsive: true,
           maintainAspectRatio: false,
           plugins: { legend: { display: false } },
           scales: {
             y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
             x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 10 } }
           }
         }
       });
    });
  }
}
