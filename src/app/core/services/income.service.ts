import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse, Income, CreateIncomeRequest,
  UpdateIncomeRequest, TotalResponse
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private base = 'incomes';

  constructor(private http: HttpClient) {}

  addIncome(request: CreateIncomeRequest): Observable<ApiResponse<Income>> {
    return this.http.post<ApiResponse<Income>>(this.base, request);
  }

  getIncomeById(id: number): Observable<ApiResponse<Income>> {
    return this.http.get<ApiResponse<Income>>(`${this.base}/${id}`);
  }

  getUserIncomes(): Observable<ApiResponse<Income[]>> {
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/user`);
  }

  getByPaymentMethod(paymentMethod: string): Observable<ApiResponse<Income[]>> {
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/payment-method/${paymentMethod}`);
  }

  getByDateRange(startDate: string, endDate: string): Observable<ApiResponse<Income[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/date-range`, { params });
  }

  getByMonth(month: number, year: number): Observable<ApiResponse<Income[]>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/month`, { params });
  }

  searchIncomes(keyword: string): Observable<ApiResponse<Income[]>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/search`, { params });
  }

  filterIncomes(filters: {
    keyword?: string; paymentMethod?: string;
    startDate?: string; endDate?: string; recurring?: boolean;
  }): Observable<ApiResponse<Income[]>> {
    let params = new HttpParams();
    if (filters.keyword) params = params.set('keyword', filters.keyword);
    if (filters.paymentMethod) params = params.set('paymentMethod', filters.paymentMethod);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.recurring !== undefined) params = params.set('recurring', filters.recurring);
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/filter`, { params });
  }

  getRecurringIncomes(): Observable<ApiResponse<Income[]>> {
    return this.http.get<ApiResponse<Income[]>>(`${this.base}/recurring`);
  }

  getTotal(): Observable<ApiResponse<TotalResponse>> {
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total`);
  }

  getTotalByMonth(month: number, year: number): Observable<ApiResponse<TotalResponse>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total/month`, { params });
  }

  getTotalByDateRange(startDate: string, endDate: string): Observable<ApiResponse<TotalResponse>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ApiResponse<TotalResponse>>(`${this.base}/total/date-range`, { params });
  }

  updateIncome(id: number, request: UpdateIncomeRequest): Observable<ApiResponse<Income>> {
    return this.http.put<ApiResponse<Income>>(`${this.base}/${id}`, request);
  }

  deleteIncome(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
