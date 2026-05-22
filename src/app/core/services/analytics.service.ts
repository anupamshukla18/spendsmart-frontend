import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse, MonthlySummary, YearlySummary,
  CategoryBreakdownItem, IncomeVsExpensePoint,
  DailyTrendPoint, SavingsRatePoint, TopCategoryItem,
  CashFlowSummary, SpendingForecast, FinancialHealthScore
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = 'analytics';

  constructor(private http: HttpClient) {}

  getMonthlySummary(month: number, year: number): Observable<ApiResponse<MonthlySummary>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<MonthlySummary>>(`${this.base}/monthly-summary`, { params });
  }

  getYearlySummary(year: number): Observable<ApiResponse<YearlySummary>> {
    const params = new HttpParams().set('year', year);
    return this.http.get<ApiResponse<YearlySummary>>(`${this.base}/yearly-summary`, { params });
  }

  getCategoryBreakdown(startDate: string, endDate: string): Observable<ApiResponse<CategoryBreakdownItem[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ApiResponse<CategoryBreakdownItem[]>>(`${this.base}/category-breakdown`, { params });
  }

  getIncomeVsExpense(month: number, year: number): Observable<ApiResponse<IncomeVsExpensePoint[]>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<IncomeVsExpensePoint[]>>(`${this.base}/income-vs-expense`, { params });
  }

  getDailyTrend(month: number, year: number): Observable<ApiResponse<DailyTrendPoint[]>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<DailyTrendPoint[]>>(`${this.base}/daily-trend`, { params });
  }

  getSavingsRate(month: number, year: number): Observable<ApiResponse<SavingsRatePoint[]>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<SavingsRatePoint[]>>(`${this.base}/savings-rate`, { params });
  }

  getTopCategories(startDate: string, endDate: string): Observable<ApiResponse<TopCategoryItem[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ApiResponse<TopCategoryItem[]>>(`${this.base}/top-categories`, { params });
  }

  getCashflow(month: number, year: number): Observable<ApiResponse<CashFlowSummary>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<CashFlowSummary>>(`${this.base}/cashflow`, { params });
  }

  getForecast(): Observable<ApiResponse<SpendingForecast>> {
    return this.http.get<ApiResponse<SpendingForecast>>(`${this.base}/forecast`);
  }

  getHealthScore(): Observable<ApiResponse<FinancialHealthScore>> {
    return this.http.get<ApiResponse<FinancialHealthScore>>(`${this.base}/health-score`);
  }
}
