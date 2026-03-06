"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button, Input, PriceDisplay } from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/format-price";

export default function CheckoutPage() {
  const { items, itemCount, total, removeItem } = useCart();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email || !email.includes("@")) {
      toast("Inserisci un'email valida", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer_email: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Errore durante il checkout", "error");
        return;
      }

      // Redirect to Stripe checkout URL
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast("Errore di connessione", "error");
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="container-app py-16 text-center">
        <ShoppingCart size={48} className="mx-auto text-neutral-400 mb-4" />
        <h1 className="text-display-sm mb-2">Il carrello è vuoto</h1>
        <p className="text-body-sm text-neutral-400 mb-6">
          Aggiungi qualche appunto dal catalogo per iniziare.
        </p>
        <Link href="/catalogo">
          <Button>Vai al catalogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Continua lo shopping
      </Link>

      <h1 className="text-display-sm mb-6">Carrello ({itemCount})</h1>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-3 p-3 rounded-brand bg-neutral-50 border border-neutral-200"
          >
            <div className="w-16 h-12 rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0 relative">
              {item.preview_image ? (
                <Image
                  src={item.preview_image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-caption">
                  PDF
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-neutral-800 truncate">
                {item.name}
              </p>
              <PriceDisplay
                price={item.price}
                originalPrice={item.original_price}
                size="sm"
              />
            </div>
            <button
              onClick={() => removeItem(item.product_id)}
              className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-brand bg-neutral-50 border border-neutral-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-body-md text-neutral-700">Totale</span>
          <span className="text-display-sm font-bold">{formatPrice(total)}</span>
        </div>

        <Input
          label="Email per ricevere i download"
          type="email"
          placeholder="la-tua@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleCheckout}
          loading={loading}
          className="w-full"
          size="lg"
        >
          Procedi al pagamento
        </Button>

        <p className="text-caption text-neutral-400 text-center mt-3">
          Pagamento sicuro tramite Stripe. Non memorizziamo i dati della tua
          carta.
        </p>
      </div>
    </div>
  );
}
