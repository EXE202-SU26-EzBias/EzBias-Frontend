import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import { fandomKeys } from './fandom.service';
import type {
  CreateReviewPayload,
  ProductReview,
  ReviewEligibility,
  ReviewSummary,
  UpdateReviewPayload,
} from '../types/review';

export const reviewKeys = {
  all: ['reviews'] as const,
  summary: (productId: number) => [...reviewKeys.all, 'summary', productId] as const,
  eligibility: (productId: number) => [...reviewKeys.all, 'eligibility', productId] as const,
};

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: reviewKeys.summary(productId),
    queryFn: () =>
      http.get<ReviewSummary>(`/api/products/${productId}/reviews`).then((r) => r.data),
    enabled: productId > 0,
  });
}

export function useReviewEligibility(productId: number, enabled: boolean) {
  return useQuery({
    queryKey: reviewKeys.eligibility(productId),
    queryFn: () =>
      http
        .get<ReviewEligibility>(`/api/products/${productId}/reviews/eligibility`)
        .then((r) => r.data),
    enabled: enabled && productId > 0,
  });
}

function invalidateReviews(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: number,
) {
  queryClient.invalidateQueries({ queryKey: reviewKeys.summary(productId) });
  queryClient.invalidateQueries({ queryKey: reviewKeys.eligibility(productId) });
  queryClient.invalidateQueries({ queryKey: fandomKeys.productDetail(productId) });
}

export function useCreateReview(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      http
        .post<ProductReview>(`/api/products/${productId}/reviews`, payload)
        .then((r) => r.data),
    onSuccess: () => invalidateReviews(queryClient, productId),
  });
}

export function useUpdateReview(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: number; payload: UpdateReviewPayload }) =>
      http.put<ProductReview>(`/api/reviews/${reviewId}`, payload).then((r) => r.data),
    onSuccess: () => invalidateReviews(queryClient, productId),
  });
}

export function useDeleteReview(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) =>
      http.delete(`/api/reviews/${reviewId}`).then((r) => r.data),
    onSuccess: () => invalidateReviews(queryClient, productId),
  });
}
