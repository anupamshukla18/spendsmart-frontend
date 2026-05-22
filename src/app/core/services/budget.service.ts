import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse, Budget, CreateBudgetRequest,
  UpdateBudgetRequest, BudgetProgress, BudgetAlert
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private base = 'budgets';

  constructor(private http: HttpClient) {}

  createBudget(request: CreateBudgetRequest): Observable<ApiResponse<Budget>> {
    return this.http.post<ApiResponse<Budget>>(this.base, request);
  }

  getBudgetById(id: number): Observable<ApiResponse<Budget>> {
    return this.http.get<ApiResponse<Budget>>(`${this.base}/${id}`);
  }

  getUserBudgets(): Observable<ApiResponse<Budget[]>> {
    return this.http.get<ApiResponse<Budget[]>>(this.base);
  }

  getActiveBudgets(): Observable<ApiResponse<Budget[]>> {
    return this.http.get<ApiResponse<Budget[]>>(`${this.base}/active`);
  }

  getBudgetsByCategory(categoryId: number): Observable<ApiResponse<Budget[]>> {
    return this.http.get<ApiResponse<Budget[]>>(`${this.base}/category/${categoryId}`);
  }

  getBudgetProgress(id: number): Observable<ApiResponse<BudgetProgress>> {
    return this.http.get<ApiResponse<BudgetProgress>>(`${this.base}/${id}/progress`);
  }

  getBudgetAlerts(): Observable<ApiResponse<BudgetAlert[]>> {
    return this.http.get<ApiResponse<BudgetAlert[]>>(`${this.base}/alerts`);
  }

  updateBudget(id: number, request: UpdateBudgetRequest): Observable<ApiResponse<Budget>> {
    return this.http.put<ApiResponse<Budget>>(`${this.base}/${id}`, request);
  }

  deleteBudget(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  resetBudgetPeriod(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/${id}/reset-period`, {});
  }
}
