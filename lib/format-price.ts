/**
 * Format price from cents to EUR display string.
 * e.g. 1499 → "14,99 €"
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
