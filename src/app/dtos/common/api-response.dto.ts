export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: any;
  statusCode?: number;
}
