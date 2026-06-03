import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import { ProfileRequestDto, ProfileResponseDto } from '../dtos/profile/profile.dto';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);

  // Update user profile by ID (admin or own profile)
  updateProfile(id: string, model: ProfileRequestDto): Observable<ApiResponseDto<ProfileResponseDto>> {
    const url = ApiAddress.updateUser.replace(':id', id);
    return this.http.put<ApiResponseDto<ProfileResponseDto>>(url, model);
  }

  // Get single user by ID
  getUserById(id: string): Observable<ApiResponseDto<ProfileResponseDto>> {
    const url = ApiAddress.getOneUserById.replace(':id', id);
    return this.http.get<ApiResponseDto<ProfileResponseDto>>(url);
  }

  // Delete user (admin only)
  deleteUser(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteUser.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  // Get all users (admin only)
  getAllUsers(): Observable<ApiResponseDto<ProfileResponseDto[]>> {
    return this.http.get<ApiResponseDto<ProfileResponseDto[]>>(ApiAddress.getAllUsers);
  }

  // Add new user (admin only)
  addUser(model: ProfileRequestDto): Observable<ApiResponseDto<ProfileResponseDto>> {
    return this.http.post<ApiResponseDto<ProfileResponseDto>>(ApiAddress.addUser, model);
  }
}
