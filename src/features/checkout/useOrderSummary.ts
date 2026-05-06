import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../constants/checkout';
import { useCart, useRemoveCartItem } from '../../services/cart.service';
import type { OrderTotal } from '../../types/checkout';

export function useOrderSummary() {
  const { data, isLoading, isError } = useCart();
  const { mutate: removeCartItem } = useRemoveCartItem();

  const items = data?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const totals: OrderTotal = { subtotal, shippingFee, total };

  return {
    items,
    totals,
    removeItem: (cartItemId: number) => removeCartItem(cartItemId),
    isEmpty: items.length === 0,
    isLoading,
    isError,
  };
}
