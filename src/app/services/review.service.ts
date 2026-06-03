import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import {
  ReviewDto,
  CreateReviewDto,
  UpdateReviewDto,
  ReviewsPaginatedResponse,
  ReviewStatsDto
} from '../dtos/review/review.dto';

// Review filter options
interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);

  // ============ Public endpoints ============

  // Get product reviews (public)
  getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<ApiResponseDto<ReviewsPaginatedResponse>> {
    const url = ApiAddress.getProductReviews.replace(':productId', productId);
    const params = this.buildParams({ page, limit });
    return this.http.get<ApiResponseDto<ReviewsPaginatedResponse>>(url, { params });
  }

  // ============ User endpoints (auth required) ============

  // Create new review
  createReview(data: CreateReviewDto): Observable<ApiResponseDto<ReviewDto>> {
    return this.http.post<ApiResponseDto<ReviewDto>>(ApiAddress.createReview, data);
  }

  // Get my reviews (paginated)
  getMyReviews(page: number = 1, limit: number = 10): Observable<ApiResponseDto<ReviewsPaginatedResponse>> {
    const params = this.buildParams({ page, limit });
    return this.http.get<ApiResponseDto<ReviewsPaginatedResponse>>(ApiAddress.getMyReviews, { params });
  }

  // Get my review statistics
  getReviewStats(): Observable<ApiResponseDto<ReviewStatsDto>> {
    return this.http.get<ApiResponseDto<ReviewStatsDto>>(ApiAddress.getReviewStats);
  }

  // Update my review
  updateReview(id: string, data: UpdateReviewDto): Observable<ApiResponseDto<ReviewDto>> {
    const url = ApiAddress.updateReview.replace(':id', id);
    return this.http.put<ApiResponseDto<ReviewDto>>(url, data);
  }

  // Delete my review
  deleteReview(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteReview.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  // ============ Private helpers ============

  private buildParams(filters: ReviewFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.rating) {
      params = params.set('rating', filters.rating.toString());
    }

    return params;
  }
}
