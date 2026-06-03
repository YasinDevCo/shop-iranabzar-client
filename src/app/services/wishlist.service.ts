import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import { WishlistItemDto, WishlistPaginatedResponse } from '../dtos/wishlist/wishlist.dto';

// Wishlist filter options
interface WishlistFilters {
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private http = inject(HttpClient);

  // Get user wishlist (paginated)
  getWishlist(page: number = 1, limit: number = 12): Observable<ApiResponseDto<WishlistPaginatedResponse>> {
    const params = this.buildParams({ page, limit });
    return this.http.get<ApiResponseDto<WishlistPaginatedResponse>>(ApiAddress.getWishlist, { params });
  }

  // Add product to wishlist
  addToWishlist(productId: string): Observable<ApiResponseDto<WishlistItemDto>> {
    const url = ApiAddress.addToWishlist.replace(':productId', productId);
    return this.http.post<ApiResponseDto<WishlistItemDto>>(url, {});
  }

  // Remove product from wishlist
  removeFromWishlist(productId: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.removeFromWishlist.replace(':productId', productId);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  // Clear entire wishlist
  clearWishlist(): Observable<ApiResponseDto<null>> {
    return this.http.delete<ApiResponseDto<null>>(ApiAddress.clearWishlist);
  }

  // ============ Private helpers ============

  private buildParams(filters: WishlistFilters): HttpParams {
    return new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '12');
  }
}
