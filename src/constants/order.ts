// Maps to DB enum order_status (1-indexed ordinal)
// 1=pending, 2=paid, 3=processing, 4=shipped, 5=delivered,
// 6=return_requested, 7=completed, 8=canceled, 9=refunded
export type OrderStatusValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  1: 'Pending',
  2: 'Paid',
  3: 'Processing',
  4: 'Shipped',
  5: 'Delivered',
  6: 'Return requested',
  7: 'Completed',
  8: 'Canceled',
  9: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<OrderStatusValue, string> = {
  1: 'text-[#b45309] bg-[#fff7ed] border-[#fde68a]',
  2: 'text-[#1d4ed8] bg-[#eff6ff] border-[#bfdbfe]',
  3: 'text-[#7c3aed] bg-[#f5f3ff] border-[#ddd6fe]',
  4: 'text-[#4338ca] bg-[#eef2ff] border-[#c7d2fe]',
  5: 'text-[#166534] bg-[#f0fdf4] border-[#bbf7d0]',
  6: 'text-[#c2410c] bg-[#fff7ed] border-[#fed7aa]',
  7: 'text-[#15803d] bg-[#f0fdf4] border-[#86efac]',
  8: 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]',
  9: 'text-[#6b7280] bg-[#f9fafb] border-[#e5e7eb]',
};

const FALLBACK_COLORS = 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]';

export function getOrderStatusLabel(status: number): string {
  return ORDER_STATUS_LABELS[status as OrderStatusValue] ?? 'Unknown';
}

export function getOrderStatusColors(status: number): string {
  return ORDER_STATUS_COLORS[status as OrderStatusValue] ?? FALLBACK_COLORS;
}
