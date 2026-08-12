/**
 * Formats a numeric price into US Dollar currency standard ($XX.XX)
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculates US tax estimation (Standard ~8.875% NYC/US state benchmark)
 */
export function calculateTax(subtotal: number, taxRate = 0.08875): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

/**
 * Calculates shipping fee ($15 flat rate, free for orders >= $100)
 */
export function calculateShipping(subtotal: number): number {
  if (subtotal === 0 || subtotal >= 100) return 0;
  return 15.0;
}
