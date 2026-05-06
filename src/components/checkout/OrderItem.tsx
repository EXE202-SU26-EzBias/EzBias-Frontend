import type { CartItem } from '../../types/cart';
import type { ArtistAccentMap } from '../../types/checkout';
import { formatCurrency } from '../../utils/formatters';

interface OrderItemProps {
  item: CartItem;
  accentMap: ArtistAccentMap;
  onRemove: (cartItemId: number) => void;
}

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b0bac3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const OrderItem = ({ item, accentMap, onRemove }: OrderItemProps) => {
  const accent = accentMap['DEFAULT'];

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(176,186,195,0.2)]">
        {item.productImage ? (
          <img src={item.productImage} alt={item.productName} className="h-full w-full rounded-lg object-cover" />
        ) : (
          <BoxIcon />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className="w-fit rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
          style={{ background: accent.bg, color: accent.text }}
        >
          Item
        </span>
        <span className="truncate text-[13px] font-medium text-[#121212]">{item.productName}</span>
        <span className="text-[11px] text-[#737373]">Qty: {item.quantity}</span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[13px] font-semibold text-[#121212]">
          {formatCurrency(item.unitPrice * item.quantity)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.cartItemId)}
          className="text-[#b0bac3] transition-colors hover:text-red-400"
          aria-label={`Remove ${item.productName}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
