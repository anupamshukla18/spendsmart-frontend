import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, RecurringTransaction, CreateRecurringRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class RecurringService {
  private base = 'recurring';

  constructor(private http: HttpClient) {}

  createRecurring(request: CreateRecurringRequest): Observable<ApiResponse<RecurringTransaction>> {
    return this.http.post<ApiResponse<RecurringTransaction>>(this.base, request);
  }

  getUserRecurring(): Observable<ApiResponse<RecurringTransaction[]>> {
    return this.http.get<ApiResponse<RecurringTransaction[]>>(`${this.base}/user`);
  }

  updateRecurring(id: number, request: CreateRecurringRequest): Observable<ApiResponse<RecurringTransaction>> {
    return this.http.put<ApiResponse<RecurringTransaction>>(`${this.base}/${id}`, request);
  }

  deactivateRecurring(id: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.base}/${id}/deactivate`, {});
  }
}
