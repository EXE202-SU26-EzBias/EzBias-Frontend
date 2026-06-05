const _fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export const formatCurrency = (amount: number | undefined | null): string =>
  amount != null ? _fmt.format(amount) : '—';

/** Compact VND for chart axes/ticks: 1_500_000 → "1.5M ₫", 12_000 → "12K ₫". */
export const formatCurrencyCompact = (amount: number | undefined | null): string => {
  if (amount == null) return '—';
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B ₫`;
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M ₫`;
  if (abs >= 1_000) return `${Math.round(amount / 1_000)}K ₫`;
  return `${Math.round(amount)} ₫`;
};

export function formatTimeAgo(iso: string): string {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return 'Unknown time';
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
