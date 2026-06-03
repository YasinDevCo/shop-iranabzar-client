// DTO برای نمایش دسته‌بندی
export interface CategoryDto {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTO برای ارسال درخواست (ایجاد/ویرایش)
export interface CategoryRequestDto {
  name?: string;
}

// برای پاسخ سرویس (اگر نیاز باشه)
export interface ResponseCategoryDto<T = any> {
  success: boolean;
  message: string;
  data: T;
}
