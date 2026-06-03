import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {
  AdminStatsDto,
  UserStatsDto,
  WidgetStatsDto,
} from '../dtos/dashboard/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  // ============ Admin endpoints ============

  // Admin full statistics with optional date range
  getAdminStats(startDate?: string, endDate?: string): Observable<ApiResponseDto<AdminStatsDto>> {
    const params = this.buildDateParams(startDate, endDate);
    return this.http.get<ApiResponseDto<AdminStatsDto>>(ApiAddress.dashboardAdminStats, { params });
  }

  // ============ User endpoints ============

  // Regular user statistics
  getUserStats(): Observable<ApiResponseDto<UserStatsDto>> {
    return this.http.get<ApiResponseDto<UserStatsDto>>(ApiAddress.dashboardUserStats);
  }

  // ============ Widget endpoints ============

  // Simple widget statistics
  getWidgetStats(): Observable<ApiResponseDto<WidgetStatsDto>> {
    return this.http.get<ApiResponseDto<WidgetStatsDto>>(ApiAddress.dashboardWidgets);
  }

  // ============ Private helpers ============

  private buildDateParams(startDate?: string, endDate?: string): HttpParams {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return params;
  }
}
