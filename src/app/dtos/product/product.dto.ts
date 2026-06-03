
// DTO برای نمایش محصول
import {CategoryDto} from '../categories/category.dto';

export interface ProductDto {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: CategoryDto | string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

// DTO برای ارسال درخواست (ایجاد/ویرایش)
export interface ProductRequestDto {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
}

// پاسخ Paginated از بک‌اند (مطابق با ProductService.getAll)
export interface ProductsPaginatedResponse {
  products: ProductDto[];
  total: number;
  page: number;
  pages: number;
}
