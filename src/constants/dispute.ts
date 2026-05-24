export type DisputeStatusValue = 'Open' | 'Approved' | 'Rejected' | 'ResolvedBuyer' | 'ResolvedSeller';

export const DISPUTE_STATUS = {
  OPEN: 'Open',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RESOLVED_BUYER: 'ResolvedBuyer',
  RESOLVED_SELLER: 'ResolvedSeller',
} as const satisfies Record<string, DisputeStatusValue>;

export const DISPUTE_STATUS_LABELS: Record<DisputeStatusValue, string> = {
  Open: 'Open',
  Approved: 'Approved',
  Rejected: 'Rejected',
  ResolvedBuyer: 'Resolved (Buyer)',
  ResolvedSeller: 'Resolved (Seller)',
};

const NEUTRAL = 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]';

export const DISPUTE_STATUS_COLORS: Record<DisputeStatusValue, string> = {
  Open: 'text-[#b45309] bg-[#fff7ed] border-[#fed7aa]',
  Approved: 'text-[#6d28d9] bg-[#f5f3ff] border-[#ddd6fe]',
  Rejected: NEUTRAL,
  ResolvedBuyer: 'text-[#166534] bg-[#f0fdf4] border-[#bbf7d0]',
  ResolvedSeller: NEUTRAL,
};

const FALLBACK_COLORS = NEUTRAL;

export function getDisputeStatusLabel(status: string): string {
  return DISPUTE_STATUS_LABELS[status as DisputeStatusValue] ?? status;
}

export function getDisputeStatusColors(status: string): string {
  return DISPUTE_STATUS_COLORS[status as DisputeStatusValue] ?? FALLBACK_COLORS;
}
