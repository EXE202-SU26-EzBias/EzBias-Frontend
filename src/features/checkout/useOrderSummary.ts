import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../constants/checkout';
import { useCartStore } from '../../stores/cart.store';
import type { OrderTotal } from '../../types/checkout';

export function useOrderSummary() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const totals: OrderTotal = { subtotal, shippingFee, total };

  return { items, totals, removeItem, isEmpty: items.length === 0 };
}
