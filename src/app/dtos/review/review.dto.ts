export interface ReviewDto {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewsPaginatedResponse {
  reviews: ReviewDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

export interface ReviewStatsDto {
  totalReviews: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
}
