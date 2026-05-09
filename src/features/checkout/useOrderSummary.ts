import { useCart, useRemoveCartItem } from '../../services/cart.service';
import type { OrderTotal } from '../../types/checkout';

export function useOrderSummary() {
  const { data, isLoading, isError } = useCart();
  const { mutate: removeCartItem } = useRemoveCartItem();

  const items = data?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const totals: OrderTotal = { subtotal, shippingFee: 0, total: subtotal };

  return {
    items,
    totals,
    removeItem: (cartItemId: number) => removeCartItem(cartItemId),
    isEmpty: items.length === 0,
    isLoading,
    isError,
  };
}
