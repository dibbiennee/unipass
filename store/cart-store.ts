import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Digital products: no duplicates (qty always 1)
          if (state.items.some((i) => i.product_id === item.product_id)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: "unipass-cart",
    }
  )
);
