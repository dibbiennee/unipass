"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart-store";
import { trackPurchase } from "@/lib/analytics";
import { formatPrice } from "@/lib/format-price";

interface OrderData {
  id: string;
  email: string;
  total: number;
  status: string;
  items: { product_name: string; price: number }[];
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const tracked = useRef(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = useCartStore.getState();
    if (!tracked.current && cart.items.length > 0) {
      const sessionId = searchParams.get("session_id") || "unknown";
      const total = cart.items.reduce((sum, item) => sum + item.price, 0);
      trackPurchase(sessionId, total, cart.items.length);
      tracked.current = true;
    }
    cart.clearCart();
  }, [searchParams]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setLoading(false);
      return;
    }
    fetch(`/api/checkout/status?session_id=${sessionId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="container-app py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>

      <h1 className="text-display-sm mb-3">Acquisto completato!</h1>

      <p className="text-body-md text-neutral-500 mb-2 max-w-sm mx-auto">
        Grazie per il tuo acquisto. Riceverai a breve un&apos;email con i link
        per scaricare i tuoi appunti.
      </p>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={24} className="animate-spin text-neutral-400" />
        </div>
      ) : order && order.items?.length > 0 ? (
        <div className="mt-6 mb-6 text-left bg-neutral-50 rounded-brand border border-neutral-200 p-4 max-w-sm mx-auto">
          <h2 className="text-body-md font-semibold mb-3">Riepilogo ordine</h2>
          <div className="space-y-2 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-body-sm">
                <span className="text-neutral-700">{item.product_name}</span>
                <span className="text-neutral-500">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-200 pt-2 flex justify-between text-body-sm font-semibold">
            <span>Totale</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="text-caption text-neutral-400 mt-2">
            Inviato a {order.email}
          </p>
        </div>
      ) : null}

      <p className="text-body-sm text-neutral-400 mb-8 max-w-sm mx-auto">
        I link di download sono validi per 48 ore e puoi scaricare i file fino
        a 5 volte. Controlla anche la cartella spam.
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/catalogo">
          <Button className="w-full">Continua a sfogliare</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full">
            Torna alla home
          </Button>
        </Link>
      </div>
    </div>
  );
}
