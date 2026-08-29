"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, Mail, Download, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { formatPrice } from "@/lib/format-price";

interface OrderItem {
  product_name: string;
  price: number;
  download_url: string | null;
  expires_at: string | null;
  downloads_left: number | null;
}

interface OrderData {
  id: string;
  email: string;
  total: number;
  status: string;
  items: OrderItem[];
}

async function fetchOrderWithRetry(sessionId: string, maxAttempts = 8): Promise<OrderData | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`/api/checkout/status?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && data.status === "completed") return data;
      }
    } catch {}
    if (i < maxAttempts - 1) await new Promise((r) => setTimeout(r, 2500));
  }
  // Return whatever we have even if pending
  try {
    const res = await fetch(`/api/checkout/status?session_id=${sessionId}`);
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) { setLoading(false); return; }
    fetchOrderWithRetry(sessionId).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [searchParams]);

  // Conversione → Nucleo, poi redirect alla thank-you di Skuoola
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    // Traccia la conversione prima di lasciare la pagina (sendBeacon sopravvive all'unload)
    try {
      const body = JSON.stringify({ site: "esamefacile", event: "conversion", page: "/checkout/success" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("https://victoranalytics-live.vercel.app/api/track", new Blob([body], { type: "text/plain" }));
      } else {
        fetch("https://victoranalytics-live.vercel.app/api/track", { method: "POST", headers: { "Content-Type": "text/plain" }, body, keepalive: true }).catch(() => {});
      }
    } catch {}
    const dest =
      "https://www.skuoola.it/acquisto/success" +
      (sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "");
    window.location.replace(dest);
  }, [searchParams]);

  const isCompleted = order?.status === "completed";
  const hasLinks = isCompleted && order?.items?.some((i) => i.download_url);

  return (
    <div className="container-app py-10 pb-28 space-y-5">

      {/* Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-50 mb-1">Ordine confermato!</h1>
        <p className="text-sm text-neutral-400">
          Grazie per il tuo acquisto su Esame Facile
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-8 text-neutral-400">
          <Loader2 size={24} className="animate-spin" />
          <p className="text-sm">Preparo i tuoi download…</p>
        </div>
      )}

      {/* Email notice */}
      {!loading && order?.email && (
        <div className="flex items-start gap-3 bg-indigo-950/50 border border-indigo-800/40 rounded-xl px-4 py-3.5">
          <Mail size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-indigo-200">
            Abbiamo inviato i link di download a{" "}
            <strong className="text-white">{order.email}</strong>
          </p>
        </div>
      )}

      {/* Download links */}
      {!loading && hasLinks && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide px-1">
            I tuoi kit
          </p>
          {order!.items.map((item, i) => (
            <div
              key={i}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-semibold text-neutral-100 leading-tight">
                  {item.product_name}
                </p>
                <span className="text-sm font-bold text-indigo-400 flex-shrink-0">
                  {formatPrice(item.price)}
                </span>
              </div>

              {item.download_url && (
                <>
                  <a
                    href={item.download_url}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                  >
                    <Download size={16} />
                    Scarica PDF
                  </a>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    {item.downloads_left !== null && (
                      <span className="flex items-center gap-1">
                        <Download size={11} />
                        {item.downloads_left} download rimasti
                      </span>
                    )}
                    {item.expires_at && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        Scade tra 48h
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order still processing / links not ready */}
      {!loading && !hasLinks && (
        <div className="flex items-start gap-3 bg-amber-950/40 border border-amber-800/40 rounded-xl px-4 py-3.5">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-200">
            Il tuo ordine è confermato e in elaborazione. Controlla la tua email (anche nello spam) —
            riceverai il link di download entro pochi minuti. Se non arriva, scrivici su WhatsApp con la
            tua email e ti inviamo subito il kit.
          </p>
        </div>
      )}

      {/* Order summary */}
      {!loading && order && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
            Riepilogo ordine
          </p>
          <div className="space-y-2 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-neutral-300">{item.product_name}</span>
                <span className="text-neutral-400">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-800 pt-3 flex justify-between">
            <span className="text-sm font-bold text-neutral-100">Totale</span>
            <span className="text-sm font-bold text-neutral-100">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {/* Save reminder */}
      {!loading && hasLinks && (
        <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5">
          <AlertCircle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-neutral-400 leading-relaxed">
            Salva il PDF sul tuo dispositivo. Il link di download è valido 48 ore e consente massimo 5 download.
          </p>
        </div>
      )}

      {/* CTA */}
      <Link href="/catalogo">
        <Button variant="secondary" className="w-full">Scopri altri kit</Button>
      </Link>

    </div>
  );
}
