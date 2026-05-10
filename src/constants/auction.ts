// Maps to DB enum auction_status (1-indexed ordinal)
// 1=draft, 2=live, 3=extended, 4=ended_no_winner, 5=ended_pending_payment,
// 6=winner_failed, 7=sold, 8=canceled
export type AuctionStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const AUCTION_STATUS = {
  DRAFT: 1,
  LIVE: 2,
  EXTENDED: 3,
  ENDED_NO_WINNER: 4,
  ENDED_PENDING_PAYMENT: 5,
  WINNER_FAILED: 6,
  SOLD: 7,
  CANCELLED: 8,
} as const satisfies Record<string, AuctionStatus>;

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  1: 'Draft',
  2: 'Live',
  3: 'Extended',
  4: 'Ended — no winner',
  5: 'Pending payment',
  6: 'Winner failed',
  7: 'Sold',
  8: 'Cancelled',
};

export const AUCTION_STATUS_COLORS: Record<AuctionStatus, string> = {
  1: 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]',
  2: 'text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]',
  3: 'text-[#2563eb] bg-[#eff6ff] border-[#bfdbfe]',
  4: 'text-[#d97706] bg-[#fffbeb] border-[#fde68a]',
  5: 'text-[#d97706] bg-[#fffbeb] border-[#fde68a]',
  6: 'text-[#dc2626] bg-[#fef2f2] border-[#fecaca]',
  7: 'text-[#7c3aed] bg-[#f5f3ff] border-[#ddd6fe]',
  8: 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]',
};

export function getAuctionStatusLabel(status: number): string {
  return AUCTION_STATUS_LABELS[status as AuctionStatus] ?? 'Unknown';
}

const FALLBACK_STATUS_COLORS = 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]';

export function getAuctionStatusColors(status: number): string {
  return AUCTION_STATUS_COLORS[status as AuctionStatus] ?? FALLBACK_STATUS_COLORS;
}
