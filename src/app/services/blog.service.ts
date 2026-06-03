import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import { BlogDto, BlogRequestDto, BlogsPaginatedResponse, BlogStatsDto } from '../dtos/blog/blog.dto';

// Filter options for blog queries
interface BlogFilters {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private http = inject(HttpClient);

  // ============ Public endpoints ============

  getPublished(page: number = 1, limit: number = 10, tag?: string, search?: string): Observable<ApiResponseDto<BlogsPaginatedResponse>> {
    const params = this.buildParams({ page, limit, tag, search });
    return this.http.get<ApiResponseDto<BlogsPaginatedResponse>>(ApiAddress.getAllBlogs, { params });
  }

  getBySlug(slug: string): Observable<ApiResponseDto<BlogDto>> {
    const url = ApiAddress.getBlogBySlug.replace(':slug', slug);
    return this.http.get<ApiResponseDto<BlogDto>>(url);
  }

  // ============ Admin endpoints ============

  getAllAdmin(page: number = 1, limit: number = 10, status?: string, search?: string): Observable<ApiResponseDto<BlogsPaginatedResponse>> {
    const params = this.buildParams({ page, limit, status, search });
    return this.http.get<ApiResponseDto<BlogsPaginatedResponse>>(ApiAddress.getAllBlogsAdmin, { params });
  }

  getById(id: string): Observable<ApiResponseDto<BlogDto>> {
    const url = ApiAddress.getBlogById.replace(':id', id);
    return this.http.get<ApiResponseDto<BlogDto>>(url);
  }

  getStats(): Observable<ApiResponseDto<BlogStatsDto>> {
    return this.http.get<ApiResponseDto<BlogStatsDto>>(ApiAddress.blogStats);
  }

  create(data: BlogRequestDto): Observable<ApiResponseDto<BlogDto>> {
    return this.http.post<ApiResponseDto<BlogDto>>(ApiAddress.createBlog, data);
  }

  update(id: string, data: Partial<BlogRequestDto>): Observable<ApiResponseDto<BlogDto>> {
    const url = ApiAddress.updateBlog.replace(':id', id);
    return this.http.put<ApiResponseDto<BlogDto>>(url, data);
  }

  delete(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteBlog.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }

  updateStatus(id: string, status: 'draft' | 'published'): Observable<ApiResponseDto<BlogDto>> {
    const url = ApiAddress.updateBlogStatus.replace(':id', id);
    return this.http.patch<ApiResponseDto<BlogDto>>(url, { status });
  }

  // ============ Private helpers ============

  private buildParams(filters: BlogFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.tag) params = params.set('tag', filters.tag);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.status) params = params.set('status', filters.status);

    return params;
  }
}
