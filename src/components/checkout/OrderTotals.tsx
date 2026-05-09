import type { OrderTotal } from '../../types/checkout';
import { formatCurrency } from '../../utils/formatters';

interface OrderTotalsProps {
  totals: OrderTotal;
}

const OrderTotals = ({ totals }: OrderTotalsProps) => (
  <div className="flex flex-col gap-2 border-t border-[#f0f0f0] pt-3">
    <div className="flex items-center justify-between text-[13px] text-[#737373]">
      <span>Subtotal</span>
      <span>{formatCurrency(totals.subtotal)}</span>
    </div>
    <div className="flex items-center justify-between text-[15px] font-bold text-[#121212]">
      <span>Total</span>
      <span>{formatCurrency(totals.total)}</span>
    </div>
  </div>
);

export default OrderTotals;
