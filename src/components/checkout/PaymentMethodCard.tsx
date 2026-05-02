import type { ReactNode } from 'react';
import type { PaymentMethod, PaymentMethodOption } from '../../types/checkout';

interface PaymentMethodCardProps {
  option: PaymentMethodOption;
  isSelected: boolean;
  onSelect: (value: PaymentMethod) => void;
}

const ICONS: Record<PaymentMethod, ReactNode> = {
  cash_on_delivery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  ),
  bank_transfer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
    </svg>
  ),
  credit_card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
};

const PaymentMethodCard = ({ option, isSelected, onSelect }: PaymentMethodCardProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={isSelected}
    onClick={() => onSelect(option.value)}
    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
      isSelected
        ? 'border-[#9b84ec] bg-[rgba(155,132,236,0.08)]'
        : 'border-[#e6e6e6] bg-white hover:border-[#c8b8f4]'
    }`}
  >
    <span className={`shrink-0 ${isSelected ? 'text-[#9b84ec]' : 'text-[#737373]'}`}>
      {ICONS[option.value]}
    </span>
    <span className="flex-1">
      <span className="block text-[13px] font-medium text-[#121212]">{option.label}</span>
      <span className="block text-[11px] text-[#737373]">{option.description}</span>
    </span>
    <span
      className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
        isSelected ? 'border-[#9b84ec] bg-[#9b84ec]' : 'border-[#b0bac3]'
      }`}
    />
  </button>
);

export default PaymentMethodCard;
