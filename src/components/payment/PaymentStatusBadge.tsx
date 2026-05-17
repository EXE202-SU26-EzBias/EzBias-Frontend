import type { PaymentStatus } from '../../types/payment';

interface PaymentStatusBadgeProps {
  status: PaymentStatus | undefined;
}

const CONFIG = {
  Paid: { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', label: 'Payment confirmed' },
  Failed: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', label: 'Payment failed' },
  Pending: { dot: 'bg-amber-400 animate-pulse', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Waiting for payment…' },
} as const satisfies Record<PaymentStatus, { dot: string; text: string; bg: string; label: string }>;

const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const cfg = (status && CONFIG[status]) ? CONFIG[status] : CONFIG.Pending;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default PaymentStatusBadge;
