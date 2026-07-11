/** The product page on Open Food Facts. */
export function offProductUrl(code: string): string {
  return `https://nl.openfoodfacts.org/product/${encodeURIComponent(code)}`
}
