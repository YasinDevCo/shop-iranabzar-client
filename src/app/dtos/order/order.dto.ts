export interface OrderItemDto {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddressDto {
  fullName: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
}

export interface OrderDto {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItemDto[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddressDto;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddressDto;
}

export interface OrdersPaginatedResponse {
  orders: OrderDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
