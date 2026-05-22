import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse, Expense, CreateExpenseRequest,
  UpdateExpenseRequest, TotalResponse
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private base = 'expenses';

  constructor(private http: HttpClient) {}

  addExpense(request: CreateExpenseRequest): Observable<ApiResponse<Expense>> {
    return this.http.post<ApiResponse<Expense>>(this.base, request);
  }

  getExpenseById(id: number): Observable<ApiResponse<Expense>> {
    return this.http.get<ApiResponse<Expense>>(`${this.base}/${id}`);
  }

  getUserExpenses(): Observable<ApiResponse<Expense[]>> {
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/user`);
  }

  getExpensesByCategory(categoryId: number): Observable<ApiResponse<Expense[]>> {
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/filter/category/${categoryId}`);
  }

  getExpensesByDateRange(startDate: string, endDate: string): Observable<ApiResponse<Expense[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/filter/date-range`, { params });
  }

  getExpensesByMonth(month: number, year: number): Observable<ApiResponse<Expense[]>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/filter/month`, { params });
  }

  getExpensesByType(type: string): Observable<ApiResponse<Expense[]>> {
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/filter/type/${type}`);
  }

  getExpensesByPaymentMethod(method: string): Observable<ApiResponse<Expense[]>> {
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/filter/payment-method/${method}`);
  }

  getExpensesByAmountRange(min: number, max: number): Observable<ApiResponse<Expense[]>> {
    const params = new HttpParams().set('min', min).set('max', max);
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/filter/amount-range`, { params });
  }

  searchExpenses(keyword: string): Observable<ApiResponse<Expense[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponse<Expense[]>>(`${this.base}/search`, { params });
  }

  getTotal(): Observable<ApiResponse<TotalResponse>> {
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total`);
  }

  getTotalByCategory(categoryId: number): Observable<ApiResponse<TotalResponse>> {
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total/category/${categoryId}`);
  }

  getTotalByDateRange(startDate: string, endDate: string): Observable<ApiResponse<TotalResponse>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total/date-range`, { params });
  }

  getTotalByMonth(month: number, year: number): Observable<ApiResponse<TotalResponse>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total/month`, { params });
  }

  updateExpense(id: number, request: UpdateExpenseRequest): Observable<ApiResponse<Expense>> {
    return this.http.put<ApiResponse<Expense>>(`${this.base}/${id}`, request);
  }

  deleteExpense(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
