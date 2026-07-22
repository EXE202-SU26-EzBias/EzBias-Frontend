export type ReviewMediaType = 'image' | 'video';

export interface ReviewMedia {
  id: number;
  type: ReviewMediaType;
  url: string;
  thumbnailUrl: string | null;
  sortOrder: number;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  username: string;
  stars: number;
  comment: string | null;
  media: ReviewMedia[];
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
  media: File[];
}

export interface UpdateReviewPayload {
  stars: number;
  comment?: string | null;
  media: File[];
  keepMediaIds: number[];
}
