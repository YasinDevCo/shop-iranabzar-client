import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {
  AdminStatsDto,
  UserStatsDto,
  WidgetStatsDto
} from '../dtos/dashboard/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  // Admin full statistics
  getAdminStats(): Observable<ApiResponseDto<AdminStatsDto>> {
    return this.http.get<ApiResponseDto<AdminStatsDto>>(ApiAddress.dashboardAdminStats);
  }

  // Regular user statistics
  getUserStats(): Observable<ApiResponseDto<UserStatsDto>> {
    return this.http.get<ApiResponseDto<UserStatsDto>>(ApiAddress.dashboardUserStats);
  }

  // Simple widget statistics
  getWidgetStats(): Observable<ApiResponseDto<WidgetStatsDto>> {
    return this.http.get<ApiResponseDto<WidgetStatsDto>>(ApiAddress.dashboardWidgets);
  }
}
