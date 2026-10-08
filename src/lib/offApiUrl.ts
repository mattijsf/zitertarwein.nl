/** The Open Food Facts API endpoint for one product, asking only for the given fields. */
export function offApiUrl(code: string, fields: string): string {
  return `https://nl.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}?fields=${fields}`
}
