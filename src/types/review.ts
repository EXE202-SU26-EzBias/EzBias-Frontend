export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  username: string;
  stars: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ReviewSummary {
  productId: number;
  averageStars: number;
  totalReviews: number;
  reviews: ProductReview[];
}

export interface ReviewEligibility {
  hasPurchased: boolean;
  existingReview: ProductReview | null;
}

export interface CreateReviewPayload {
  stars: number;
  comment?: string | null;
}

export interface UpdateReviewPayload {
  stars: number;
  comment?: string | null;
}
