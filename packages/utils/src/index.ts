export { cn } from "./cn";

/**
 * Format a price amount (in cents) as a localized currency string.
 * @param amount - Price in cents (e.g., 10000 for $100.00)
 * @param currency - ISO 4217 currency code (default: USD)
 * @returns Formatted currency string (e.g., "$100.00")
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

/**
 * Format a price amount in whole dollars.
 * @param amount - Price in dollars (e.g., 100 for $100.00)
 * @param currency - ISO 4217 currency code (default: USD)
 * @returns Formatted currency string (e.g., "$100.00")
 */
export function formatPrice(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
