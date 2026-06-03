export interface WishlistItemDto {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  addedAt: string;
}

export interface WishlistPaginatedResponse {
  items: WishlistItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
