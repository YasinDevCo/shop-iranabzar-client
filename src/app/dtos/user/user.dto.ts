// DTO برای نمایش کاربر
export interface UserDto {
  _id: string;
  name: string;
  lastName: string;
  mobile: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

// DTO برای ارسال درخواست (ایجاد/ویرایش)
export interface UserRequestDto {
  name?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
}

// پاسخ صفحه‌بندی شده
export interface UsersPaginatedResponse {
  users: UserDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
  };
}
