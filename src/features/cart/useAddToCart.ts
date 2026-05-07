import { useCallback, useEffect, useRef, useState } from 'react';
import { useAddCartItem } from '../../services/cart.service';
import { useUiStore } from '../../stores/ui.store';

export function useAddToCart() {
  const [added, setAdded] = useState(false);
  const { mutate: addCartItem, isPending } = useAddCartItem();
  const showToast = useUiStore((s) => s.showToast);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = useCallback(
    (productId: number, productName: string, quantity: number) => {
      const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
      addCartItem(
        { productId, quantity: safeQuantity },
        {
          onSuccess: () => {
            showToast(`Added "${productName}" to cart`);
            setAdded(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setAdded(false), 1500);
          },
          onError: () => {
            showToast('Failed to add item. Please try again.');
          },
        },
      );
    },
    [addCartItem, showToast],
  );

  return { added, isPending, handleAdd };
}
