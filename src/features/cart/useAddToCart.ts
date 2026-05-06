import { useState, useCallback, useRef, useEffect } from 'react';
import { useAddCartItem } from '../../services/cart.service';
import { useUiStore } from '../../stores/ui.store';

export function useAddToCart() {
  const [added, setAdded] = useState(false);
  const { mutate: addCartItem } = useAddCartItem();
  const showToast = useUiStore((s) => s.showToast);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = useCallback(
    (productId: number, productName: string) => {
      addCartItem(
        { productId, quantity: 1 },
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

  return { added, handleAdd };
}
