import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '../types/landing';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      count: 0,
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          const items = existing
            ? state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              )
            : [...state.items, { ...product, quantity: 1 }];
          return { items, count: items.reduce((sum, i) => sum + i.quantity, 0) };
        }),
      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((i) => i.id !== id);
          return { items, count: items.reduce((sum, i) => sum + i.quantity, 0) };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const items = quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i));
          return { items, count: items.reduce((sum, i) => sum + i.quantity, 0) };
        }),
      clearCart: () => set({ items: [], count: 0 }),
    }),
    {
      name: 'ezbias.cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
