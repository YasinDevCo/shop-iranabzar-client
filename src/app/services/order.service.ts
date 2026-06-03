import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {CreateOrderDto, OrderDto, OrdersPaginatedResponse} from '../dtos/order/order.dto';


// Order filters
interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  // ============ Order endpoints ============

  // Get single order by ID
  getOrderById(id: string): Observable<ApiResponseDto<OrderDto>> {
    return this.http.get<ApiResponseDto<OrderDto>>(`/orders/${id}`);
  }

  // Get my orders list (paginated)
  getMyOrders(page: number = 1, limit: number = 10, status?: string): Observable<ApiResponseDto<OrdersPaginatedResponse>> {
    const params = this.buildParams({ page, limit, status });
    return this.http.get<ApiResponseDto<OrdersPaginatedResponse>>(ApiAddress.getMyOrders, { params });
  }

  // Create new order (checkout page)
  createOrder(orderData: CreateOrderDto): Observable<ApiResponseDto<OrderDto>> {
    return this.http.post<ApiResponseDto<OrderDto>>('/orders/create', orderData);
  }

  // Cancel order
  cancelOrder(id: string): Observable<ApiResponseDto<OrderDto>> {
    return this.http.patch<ApiResponseDto<OrderDto>>(`/orders/${id}/cancel`, {});
  }

  // ============ Private helpers ============

  private buildParams(filters: OrderFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return params;
  }
}
