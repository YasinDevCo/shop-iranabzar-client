import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {LoginRequestDto, LoginResponseDto} from '../dtos/account/login.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'jwt_token';

  // ============ Token Management ============

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ============ Authentication Methods ============

  login(credentials: LoginRequestDto): Observable<ApiResponseDto<LoginResponseDto>> {
    return this.http
      .post<ApiResponseDto<LoginResponseDto>>(ApiAddress.login, credentials)
      .pipe(
        tap((response) => {
          // Auto-save token when login succeeds
          if (response.success && response.data?.token) {
            this.saveToken(response.data.token);
          }
        }),
        catchError((error) => this.handleError(error, 'Login failed'))
      );
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token !== 'null' && token !== 'undefined';
  }

  // ============ Error Handling ============

  private handleError(error: any, context: string = 'An error occurred'): Observable<never> {
    console.error(`[AuthService] ${context}:`, error);

    const errorMessage = error.error?.message || error.message || 'Unknown server error';
    return throwError(() => new Error(errorMessage));
  }
}
