import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy alias for backward compat
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return Reflect.get(getStripeServer(), prop);
  },
});
