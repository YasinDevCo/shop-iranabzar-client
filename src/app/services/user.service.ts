import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import { UserDto, UserRequestDto, UsersPaginatedResponse } from '../dtos/user/user.dto';

// User filter options
interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  // Get all users with pagination (admin only)
  getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string
  ): Observable<ApiResponseDto<UsersPaginatedResponse>> {
    const params = this.buildParams({ page, limit, search, role });
    return this.http.get<ApiResponseDto<UsersPaginatedResponse>>(ApiAddress.getAllUsers, { params });
  }

  // Get single user by ID (admin only)
  getUserById(id: string): Observable<ApiResponseDto<{ user: UserDto }>> {
    const url = ApiAddress.getOneUserById.replace(':id', id);
    return this.http.get<ApiResponseDto<{ user: UserDto }>>(url);
  }

  // Add new user (admin only)
  addUser(model: UserRequestDto): Observable<ApiResponseDto<{ user: UserDto }>> {
    return this.http.post<ApiResponseDto<{ user: UserDto }>>(ApiAddress.addUser, model);
  }

  // Update user (admin or own profile)
  updateUser(id: string, model: UserRequestDto): Observable<ApiResponseDto<{ user: UserDto; token?: string }>> {
    const url = ApiAddress.updateUser.replace(':id', id);
    return this.http.put<ApiResponseDto<{ user: UserDto; token?: string }>>(url, model);
  }

  // Delete user (admin only)
  deleteUser(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteUser.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  // ============ Private helpers ============

  private buildParams(filters: UserFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.role) {
      params = params.set('role', filters.role);
    }

    return params;
  }
}
