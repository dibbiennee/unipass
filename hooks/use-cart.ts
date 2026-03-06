"use client";

import { useCartStore } from "@/store/cart-store";
import { useCartHydrated } from "@/components/providers/cart-hydration";
import { CartItem } from "@/types";

export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const hydrated = useCartHydrated();

  const isInCart = (productId: string) =>
    items.some((i) => i.product_id === productId);

  return {
    items: hydrated ? items : [],
    itemCount: hydrated ? items.length : 0,
    total: hydrated ? getTotal() : 0,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    hydrated,
  };
}
