import { useState } from 'react';
import StarRating from '../ui/StarRating';
import { useReviewForm } from '../../features/review/useReviewForm';
import {
  useDeleteReview,
  useProductReviews,
  useReviewEligibility,
} from '../../services/review.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import { formatTimeAgo } from '../../utils/formatters';
import type { ProductReview } from '../../types/review';

interface ReviewsSectionProps {
  productId: number;
}

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUserId = useAuthStore((s) => s.user?.userId);
  const openLogin = useUiStore((s) => s.openLogin);

  const { data: summary, isLoading } = useProductReviews(productId);
  const { data: eligibility } = useReviewEligibility(productId, isAuthenticated);

  const existingReview = eligibility?.existingReview ?? null;
  const form = useReviewForm(productId, existingReview);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(productId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const showToast = useUiStore((s) => s.showToast);

  const handleDelete = () => {
    if (!existingReview) return;
    deleteReview(existingReview.id, {
      onSuccess: () => {
        showToast('Review removed.', 'success');
        setConfirmingDelete(false);
      },
      onError: () => showToast('Could not remove review. Please try again.', 'error'),
    });
  };

  const reviews = summary?.reviews ?? [];
  const average = summary?.averageStars ?? 0;
  const total = summary?.totalReviews ?? 0;

  return (
    <section className="mt-12 border-t border-[#e6e6e6] pt-10">
      <h2 className="text-xl font-bold text-[#121212]">Reviews</h2>

      {/* Summary */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl font-bold text-[#121212]">{average.toFixed(1)}</span>
        <div className="flex flex-col">
          <StarRating value={average} size={18} />
          <span className="mt-0.5 text-[13px] text-[#737373]">
            {total === 0 ? 'No reviews yet' : `${total} review${total > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 flex flex-col gap-5">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-[#737373]">Be the first to review this product.</p>
        ) : (
          reviews.map((review: ProductReview) => (
            <div key={review.id} className="border-b border-[#f0f0f0] pb-5 last:border-b-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#121212]">{review.username}</span>
                  {review.userId === currentUserId && (
                    <span className="rounded-full bg-[#f0edf7] px-2 py-0.5 text-[10px] font-semibold text-[#7c3aed]">
                      You
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#a3a3a3]">
                  {formatTimeAgo(review.createdAt)}
                  {review.updatedAt ? ' (edited)' : ''}
                </span>
              </div>
              <StarRating value={review.stars} size={14} className="mt-1.5" />
              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-[#525252]">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form / gating */}
      <div className="mt-8 rounded-2xl border border-[#e6e6e6] bg-[#faf9fc] p-5">
        {!isAuthenticated ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-[#737373]">Log in to leave a review.</p>
            <button
              type="button"
              onClick={openLogin}
              className="inline-flex h-10 items-center rounded-full bg-[#ad93e6] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#9d7ed9]"
            >
              Log in
            </button>
          </div>
        ) : !eligibility?.hasPurchased ? (
          <p className="text-sm text-[#737373]">
            Only verified buyers can review this product.
          </p>
        ) : (
          <form onSubmit={form.onSubmit} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#121212]">
              {form.isEditing ? 'Edit your review' : 'Leave a review'}
            </h3>

            <div>
              <StarRating value={form.stars} onChange={form.setStars} size={26} />
              {form.errors.stars && (
                <p className="mt-1 text-[12px] text-[#ef4343]">{form.errors.stars.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...form.register('comment')}
                rows={4}
                placeholder="Share your experience with this product (optional)"
                className="w-full resize-none rounded-xl border border-[#e6e6e6] bg-white px-3.5 py-2.5 text-sm text-[#121212] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#ad93e6]"
              />
              {form.errors.comment && (
                <p className="mt-1 text-[12px] text-[#ef4343]">{form.errors.comment.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={form.isPending}
                className="inline-flex h-10 items-center rounded-full bg-[#ad93e6] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#9d7ed9] disabled:opacity-50"
              >
                {form.isPending
                  ? 'Saving…'
                  : form.isEditing
                    ? 'Update review'
                    : 'Submit review'}
              </button>

              {form.isEditing &&
                (confirmingDelete ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex h-10 items-center rounded-full bg-[#dc2626] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-50"
                    >
                      {isDeleting ? 'Removing…' : 'Confirm delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="text-[13px] font-medium text-[#737373] hover:text-[#121212]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="inline-flex h-10 items-center rounded-full border border-[#e6e6e6] px-5 text-[13px] font-semibold text-[#737373] transition-colors hover:bg-white"
                  >
                    Delete
                  </button>
                ))}
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
