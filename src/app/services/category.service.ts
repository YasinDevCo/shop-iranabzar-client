import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { ApiAddress } from '../utilities/api-address-util';
import { CategoryDto, CategoryRequestDto } from '../dtos/categories/category.dto';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  // Get all categories
  getAllCategories(): Observable<ApiResponseDto<CategoryDto[]>> {
    return this.http.get<ApiResponseDto<CategoryDto[]>>(ApiAddress.getAllCategories);
  }

  // Create new category (admin only)
  createCategory(model: CategoryRequestDto): Observable<ApiResponseDto<CategoryDto>> {
    return this.http.post<ApiResponseDto<CategoryDto>>(ApiAddress.createCategory, model);
  }

  // Update category (admin only)
  updateCategory(id: string, model: CategoryRequestDto): Observable<ApiResponseDto<CategoryDto>> {
    const url = ApiAddress.updateCategory.replace(':id', id);
    return this.http.put<ApiResponseDto<CategoryDto>>(url, model);
  }

  // Delete category (admin only)
  deleteCategory(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteCategory.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }
}
