import React, { useState } from 'react';
import type { AxiosError } from 'axios';
import { useAdminDeleteReview, useAdminReviews } from '../../../services/admin.service';
import type { AdminReviewListItem } from '../../../types/admin';
import { formatTimeAgo } from '../../../utils/formatters';
import { useUiStore } from '../../../stores/ui.store';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

// ==================== Star display ====================

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= count ? '#f59e0b' : '#e6e6e6'}
          aria-hidden="true"
        >
          <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5Z" />
        </svg>
      ))}
      <span className="ml-1 text-[12px] font-semibold text-[#121212]">{count}/5</span>
    </span>
  );
}

// ==================== Row ====================

function ReviewRow({ review, onDelete }: { review: AdminReviewListItem; onDelete: (id: number) => void }) {
  return (
    <tr className="border-b border-[rgba(230,230,230,0.5)] hover:bg-[rgba(173,147,230,0.04)] transition-colors">
      <td className="px-4 py-[13px] text-[12px] text-[#737373] whitespace-nowrap">#{review.id}</td>
      <td className="px-4 py-[13px] align-middle">
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[#121212] truncate max-w-[200px]">{review.productName}</span>
          <span className="text-[11px] text-[#737373]">ID #{review.productId}</span>
        </div>
      </td>
      <td className="px-4 py-[13px] align-middle">
        <span className="text-[13px] font-medium text-[#121212]">{review.username}</span>
      </td>
      <td className="px-4 py-[13px] align-middle">
        <Stars count={review.stars} />
      </td>
      <td className="px-4 py-[13px] text-[12px] text-[#737373] max-w-[280px]">
        {review.comment
          ? <span className="line-clamp-2">{review.comment}</span>
          : <span className="italic text-[#b3b3b3]">No comment</span>}
      </td>
      <td className="px-4 py-[13px] text-[12px] text-[#737373] whitespace-nowrap">
        {formatTimeAgo(review.createdAt)}
      </td>
      <td className="px-4 py-[13px] text-[12px] text-[#737373] whitespace-nowrap">
        {review.updatedAt ? formatTimeAgo(review.updatedAt) : '—'}
      </td>
      <td className="px-4 py-[13px] align-middle">
        <button
          type="button"
          onClick={() => onDelete(review.id)}
          className="h-7 px-3 rounded-lg text-[12px] font-medium text-[#ef4343] border border-[rgba(239,67,67,0.3)] hover:bg-[rgba(239,67,67,0.06)] transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

// ==================== Main ====================

const COLS = ['#', 'Product', 'User', 'Rating', 'Comment', 'Posted At', 'Updated At', ''] as const;

const ReviewsSection = React.memo(function ReviewsSection() {
  const { data: reviews = [], isLoading, isError, refetch } = useAdminReviews();
  const { mutate: deleteReview, isPending: deleting } = useAdminDeleteReview();
  const showToast = useUiStore((s) => s.showToast);
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');

  const filtered = filterStars === 'all'
    ? reviews
    : reviews.filter((r) => r.stars === filterStars);

  const handleDelete = (id: number) => {
    if (!window.confirm('Deleting this review cannot be undone. Continue?')) return;
    deleteReview(id, {
      onSuccess: () => showToast('Review deleted.', 'success'),
      onError: (err) => {
        const msg = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Delete failed.';
        showToast(msg, 'error');
      },
    });
  };

  // Star distribution counts
  const countByStar = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.stars === s).length,
  }));

  return (
    <div>
      <SellerTopbar title="Product Reviews" sub="Review history from buyers" />

      {/* Stats bar */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-5 bg-white border border-[rgba(230,230,230,0.5)] rounded-xl px-5 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex-wrap">
          <button
            type="button"
            onClick={() => setFilterStars('all')}
            className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${
              filterStars === 'all'
                ? 'bg-[#ad93e6] text-white'
                : 'text-[#737373] hover:bg-[rgba(173,147,230,0.1)]'
            }`}
          >
            All ({reviews.length})
          </button>
          {countByStar.map(({ stars, count }) => (
            <button
              key={stars}
              type="button"
              onClick={() => setFilterStars(stars)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors flex items-center gap-1 ${
                filterStars === stars
                  ? 'bg-[#f59e0b] text-white'
                  : 'text-[#737373] hover:bg-[rgba(245,158,11,0.1)]'
              }`}
            >
              {'★'.repeat(stars)} ({count})
            </button>
          ))}
        </div>
      )}

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[14px] text-[#ef4343]">Failed to load data.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-[12px] font-medium px-4 h-8 rounded-full border border-[#e6e6e6] bg-white text-[#737373] hover:border-[#ad93e6] hover:text-[#ad93e6] transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="px-5 py-16 text-center text-[14px] text-[#737373]">
            No reviews found.
          </p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {COLS.map((h, i) => (
                    <th
                      key={i}
                      className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <ReviewRow
                    key={r.id}
                    review={r}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleting && (
        <div className="fixed bottom-6 right-6 bg-[#121212] text-white text-[13px] px-4 py-2 rounded-lg shadow-lg">
          Deleting…
        </div>
      )}
    </div>
  );
});

export default ReviewsSection;
