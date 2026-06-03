export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface CartItemDto {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  stock: number;
}
