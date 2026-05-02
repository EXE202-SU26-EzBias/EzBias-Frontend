import { useState, useCallback, useRef, useEffect } from 'react';
import { useCartStore } from '../../stores/cart.store';
import { useUiStore } from '../../stores/ui.store';
import type { Product } from '../../types/landing';

export function useAddToCart() {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUiStore((s) => s.showToast);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = useCallback(
    (product: Product) => {
      addItem(product);
      showToast(`Added "${product.name}" to cart`);
      setAdded(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setAdded(false), 1500);
    },
    [addItem, showToast]
  );

  return { added, handleAdd };
}
