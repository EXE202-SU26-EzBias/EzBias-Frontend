const _fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export const formatCurrency = (amount: number | undefined | null): string =>
  amount != null ? _fmt.format(amount) : '—';
