export interface PaymentDto {
  _id: string;
  orderId: any;
  userId: any;
  amount: number;
  transactionCode: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    mobile: string;
  };
  orderNumber?: string;
}

export interface PaymentRequestDto {
  orderId: string;
}

export interface PaymentResponseDto {
  payment: PaymentDto;
  paymentUrl: string;
}

export interface PaymentsPaginatedResponse {
  payments: PaymentDto[];
  total: number;
  page: number;
  pages: number;
}
