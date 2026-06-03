import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LoginRequestDto, LoginResponseDto} from '../dtos/account/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from '../dtos/account/register.dto';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';


@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private TOKEN_KEY = 'jwt_token';
  private USER_KEY = 'user';

  register(model: RegisterRequestDto): Observable<ApiResponseDto<RegisterResponseDto>> {
    return this.http.post<ApiResponseDto<RegisterResponseDto>>(ApiAddress.register, model);
  }

  login(model: LoginRequestDto): Observable<ApiResponseDto<LoginResponseDto>> {
    return this.http.post<ApiResponseDto<LoginResponseDto>>(ApiAddress.login, model);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  storeAuthData(token: string, user: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && token !== 'undefined' && token !== 'null';
  }

  isAdmin(): boolean {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return false;

    try {
      const user = JSON.parse(userJson);
      return user?.role === 'admin';
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
}
