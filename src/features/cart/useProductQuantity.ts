import { useCallback, useState } from 'react';

export function useProductQuantity(stock: number) {
  const isOutOfStock = stock === 0;
  const maxQuantity = stock;
  const [quantity, setQuantity] = useState(1);

  const increment = useCallback(
    () => setQuantity((prev) => Math.min(maxQuantity, prev + 1)),
    [maxQuantity],
  );
  const decrement = useCallback(() => setQuantity((prev) => Math.max(1, prev - 1)), []);

  return { quantity, maxQuantity, isOutOfStock, increment, decrement };
}
