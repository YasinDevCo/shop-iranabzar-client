import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {
  PaymentDto,
  PaymentRequestDto,
  PaymentResponseDto,
  PaymentsPaginatedResponse
} from '../dtos/payment/payment.dto';

// Payment filters
interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  // ============ Public endpoints ============

  // Create new payment request
  createPayment(model: PaymentRequestDto): Observable<ApiResponseDto<PaymentResponseDto>> {
    return this.http.post<ApiResponseDto<PaymentResponseDto>>(ApiAddress.createPayment, model);
  }

  // Verify payment
  verifyPayment(id: string): Observable<ApiResponseDto<PaymentDto>> {
    const url = ApiAddress.verifyPayment.replace(':id', id);
    return this.http.get<ApiResponseDto<PaymentDto>>(url);
  }

  // Cancel payment
  cancelPayment(id: string): Observable<ApiResponseDto<PaymentDto>> {
    const url = ApiAddress.cancelPayment.replace(':id', id);
    return this.http.get<ApiResponseDto<PaymentDto>>(url);
  }

  // ============ User endpoints ============

  // Get my payments (paginated)
  getMyPayments(page: number = 1, limit: number = 10): Observable<ApiResponseDto<PaymentsPaginatedResponse>> {
    const params = this.buildParams({ page, limit });
    return this.http.get<ApiResponseDto<PaymentsPaginatedResponse>>(ApiAddress.getMyPayments, { params });
  }

  // Get single payment by ID
  getPaymentById(id: string): Observable<ApiResponseDto<PaymentDto>> {
    const url = ApiAddress.getPaymentById.replace(':id', id);
    return this.http.get<ApiResponseDto<PaymentDto>>(url);
  }

  // ============ Admin endpoints ============

  // Get all payments (admin only)
  getAllPayments(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Observable<ApiResponseDto<PaymentsPaginatedResponse>> {
    const params = this.buildParams({ page, limit, status, search });
    return this.http.get<ApiResponseDto<PaymentsPaginatedResponse>>(ApiAddress.getAllPayments, { params });
  }

  // Delete payment (admin only)
  deletePayment(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deletePayment.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  // ============ Private helpers ============

  private buildParams(filters: PaymentFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return params;
  }
}
