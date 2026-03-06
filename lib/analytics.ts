type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
  }
}

export function trackEvent(eventName: string, params?: EventParams) {
  // GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }

  // Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }

  // TikTok Pixel
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(eventName, params);
  }
}

export function trackViewProduct(productId: string, productName: string, price: number) {
  trackEvent("ViewContent", {
    content_type: "product",
    content_id: productId,
    content_name: productName,
    value: price / 100,
    currency: "EUR",
  });
}

export function trackAddToCart(productId: string, productName: string, price: number) {
  trackEvent("AddToCart", {
    content_type: "product",
    content_id: productId,
    content_name: productName,
    value: price / 100,
    currency: "EUR",
  });
}

export function trackPurchase(orderId: string, total: number, itemCount: number) {
  trackEvent("Purchase", {
    transaction_id: orderId,
    value: total / 100,
    currency: "EUR",
    num_items: itemCount,
  });
}
