import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponseDto} from '../dtos/common/api-response.dto';
import {ProductDto, ProductRequestDto, ProductsPaginatedResponse} from '../dtos/product/product.dto';
import {ApiAddress} from '../utilities/api-address-util';

// Product filter options
interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
}

@Injectable({providedIn: 'root'})
export class ProductService {
  private http = inject(HttpClient);

  // Get all products with pagination and optional search
  getAll(page: number = 1, limit: number = 12, search?: string): Observable<ApiResponseDto<ProductsPaginatedResponse>> {
    return this.getFilteredProducts({page, limit, search});
  }

  // Get products with advanced filters
  getFilteredProducts(filters: ProductFilters): Observable<ApiResponseDto<ProductsPaginatedResponse>> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '12');

    if (filters.search) params = params.set('search', filters.search);
    if (filters.categories) params = params.set('categories', filters.categories);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStock) params = params.set('inStock', 'true');
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<ApiResponseDto<ProductsPaginatedResponse>>(ApiAddress.filterProducts, {params});
  }

  // Get single product by ID
  getById(id: string): Observable<ApiResponseDto<ProductDto>> {
    const url = ApiAddress.getProductById.replace(':id', id);
    return this.http.get<ApiResponseDto<ProductDto>>(url);
  }

  // Get products by category ID
  getByCategory(categoryId: string): Observable<ApiResponseDto<ProductDto[]>> {
    const url = ApiAddress.getProductsByCategory.replace(':categoryId', categoryId);
    return this.http.get<ApiResponseDto<ProductDto[]>>(url);
  }

  // Create new product (admin only)
  create(model: ProductRequestDto): Observable<ApiResponseDto<ProductDto>> {
    return this.http.post<ApiResponseDto<ProductDto>>(ApiAddress.createProduct, model);
  }

  // Update product (admin only)
  update(id: string, model: ProductRequestDto): Observable<ApiResponseDto<ProductDto>> {
    const url = ApiAddress.updateProduct.replace(':id', id);
    return this.http.put<ApiResponseDto<ProductDto>>(url, model);
  }

  // Delete product (admin only)
  delete(id: string): Observable<ApiResponseDto<null>> {
    const url = ApiAddress.deleteProduct.replace(':id', id);
    return this.http.delete<ApiResponseDto<null>>(url);
  }
}
