import type { CartItem } from '../../types/cart';
import type { OrderTotal } from '../../types/checkout';
import OrderItemList from './OrderItemList';
import OrderTotals from './OrderTotals';

interface OrderSummarySectionProps {
  items: CartItem[];
  totals: OrderTotal;
  onRemoveItem: (cartItemId: number) => void;
}

const OrderSummarySection = ({ items, totals, onRemoveItem }: OrderSummarySectionProps) => (
  <div className="rounded-xl border border-[#f0f0f0] bg-white p-5 shadow-sm lg:self-start lg:sticky lg:top-6">
    <h2 className="mb-1 text-[15px] font-semibold text-[#121212]">Order Summary</h2>
    {items.length === 0 ? (
      <p className="py-8 text-center text-[13px] text-[#737373]">Your cart is empty.</p>
    ) : (
      <>
        <OrderItemList items={items} onRemove={onRemoveItem} />
        <div className="mt-2">
          <OrderTotals totals={totals} />
        </div>
      </>
    )}
  </div>
);

export default OrderSummarySection;
