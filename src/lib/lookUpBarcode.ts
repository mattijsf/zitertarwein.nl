import type { OffProduct } from "./lookUpOnline"
import { field, FIELDS, parseProduct } from "./lookUpOnline"

const PRODUCT_URL = "https://nl.openfoodfacts.org/api/v2/product/"

export type BarcodeLookup =
  | { kind: "found"; product: OffProduct }
  /** Open Food Facts does not know this barcode. */
  | { kind: "unknown" }
  /** Network error or an error status other than 404. */
  | { kind: "unavailable" }

export function barcodeUrl(code: string): string {
  return `${PRODUCT_URL}${encodeURIComponent(code)}?fields=${FIELDS}`
}

/** Reads the product out of a product endpoint response; null when it is missing. */
export function parseProductResponse(json: unknown): OffProduct | null {
  if (typeof json !== "object" || json === null || field(json, "status") !== 1) {
    return null
  }
  const product = field(json, "product")
  return typeof product === "object" && product !== null ? parseProduct(product) : null
}

/** Looks up a scanned barcode on the Open Food Facts product endpoint. */
export async function lookUpBarcode(code: string): Promise<BarcodeLookup> {
  try {
    const res = await fetch(barcodeUrl(code))
    if (res.status === 404) {
      return { kind: "unknown" }
    }
    if (!res.ok) {
      return { kind: "unavailable" }
    }
    const product = parseProductResponse(await res.json())
    return product ? { kind: "found", product } : { kind: "unknown" }
  } catch {
    return { kind: "unavailable" }
  }
}
