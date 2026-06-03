export interface ProfileDto {
  id: string;
  name: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  role: string;
  createdAt?: string; // اختیاری، تاریخ ایجاد کاربر
  updatedAt?: string; // اختیاری، تاریخ آخرین ویرایش
}

export interface ProfileResponseDto {
  success: boolean;
  message: string;
  statusCode: number;
  data?: {
    user: {
      id: string;
      name: string;
      lastName: string;
      mobile: string;
      email: string;
      password: string;
      role: string;
      createdAt?: string; // اختیاری، تاریخ ایجاد کاربر
      updatedAt?: string; // اختیاری، تاریخ آخرین ویرایش
    }
  };
}

export class ProfileRequestDto {
  name?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  password?: string;
  role?: string;

}
