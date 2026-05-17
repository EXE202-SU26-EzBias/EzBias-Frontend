export type DisputeStatusValue = 0 | 1 | 2;

export const DISPUTE_STATUS = {
  OPEN: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const satisfies Record<string, DisputeStatusValue>;

export const DISPUTE_STATUS_LABELS: Record<DisputeStatusValue, string> = {
  0: 'Open',
  1: 'Approved',
  2: 'Rejected',
};

export const DISPUTE_STATUS_COLORS: Record<DisputeStatusValue, string> = {
  0: 'text-[#b45309] bg-[#fff7ed] border-[#fed7aa]',
  1: 'text-[#166534] bg-[#f0fdf4] border-[#bbf7d0]',
  2: 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]',
};

const FALLBACK_COLORS = 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]';

export function getDisputeStatusLabel(status: number): string {
  return DISPUTE_STATUS_LABELS[status as DisputeStatusValue] ?? 'Unknown';
}

export function getDisputeStatusColors(status: number): string {
  return DISPUTE_STATUS_COLORS[status as DisputeStatusValue] ?? FALLBACK_COLORS;
}
