"use client";

import { useEffect, useState, ReactNode } from "react";
import { useCartStore } from "@/store/cart-store";

export function CartHydration({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Trigger Zustand persist rehydration
    useCartStore.persist.rehydrate();
  }, []);

  // Render children always, but cart-dependent UI should check hydration
  // This prevents SSR hydration mismatch for cart badge counts etc.
  return <>{children}</>;
}

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    // Check if already hydrated
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);
  return hydrated;
}
