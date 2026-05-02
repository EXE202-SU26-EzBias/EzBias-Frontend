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
  removeItem: (name: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      count: 0,
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.name === product.name);
          const items = existing
            ? state.items.map((i) =>
                i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i,
              )
            : [...state.items, { ...product, quantity: 1 }];
          return { items, count: items.reduce((sum, i) => sum + i.quantity, 0) };
        }),
      removeItem: (name) =>
        set((state) => {
          const items = state.items.filter((i) => i.name !== name);
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
