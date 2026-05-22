import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  PaymentResponse,
} from "../models/api.models";

@Injectable({ providedIn: "root" })
export class PaymentApiService {
  private base = "/api/payments";

  constructor(private http: HttpClient) {}

  createOrder(
    request: CreateOrderRequest,
  ): Observable<ApiResponse<CreateOrderResponse>> {
    return this.http.post<ApiResponse<CreateOrderResponse>>(
      `${this.base}/order`,
      request,
    );
  }

  verifyPayment(
    request: VerifyPaymentRequest,
  ): Observable<ApiResponse<PaymentResponse>> {
    return this.http.post<ApiResponse<PaymentResponse>>(
      `${this.base}/verify`,
      request,
    );
  }

  getPaymentHistory(
    page: number = 0,
    size: number = 10,
  ): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());
    return this.http.get<ApiResponse<any>>(`${this.base}/history`, { params });
  }

  getPaymentById(paymentId: number): Observable<ApiResponse<PaymentResponse>> {
    return this.http.get<ApiResponse<PaymentResponse>>(
      `${this.base}/${paymentId}`,
    );
  }
}
