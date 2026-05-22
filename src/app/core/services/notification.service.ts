import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, Notification, UnreadCountResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private base = 'notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.base}/recipient`);
  }

  getUnreadCount(): Observable<ApiResponse<UnreadCountResponse>> {
    return this.http.get<ApiResponse<UnreadCountResponse>>(`${this.base}/unread-count`).pipe(
      tap(res => this.unreadCountSubject.next(res?.data?.unreadCount || 0))
    );
  }

  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe();
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${id}/read`, {}).pipe(
      tap(() => this.refreshUnreadCount())
    );
  }

  markAllRead(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/read-all`, {}).pipe(
      tap(() => this.refreshUnreadCount())
    );
  }

  acknowledge(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.base}/${id}/acknowledge`, {}).pipe(
      tap(() => this.refreshUnreadCount())
    );
  }

  deleteNotification(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(
      tap(() => this.refreshUnreadCount())
    );
  }
}
