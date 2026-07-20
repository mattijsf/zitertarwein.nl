import type { Product } from "../types/product"
import { normalize } from "./normalize"

export type BrowseTab = "all" | "yes" | "no"

export const BROWSE_TABS: readonly BrowseTab[] = ["all", "yes", "no"]

export type BrowseLists = Record<BrowseTab, readonly Product[]>

/**
 * The browse tabs: everything, contains wheat, wheat-free. Curated generic products (brood,
 * appel…) first, then branded Open Food Facts items; each group alphabetical, ignoring
 * punctuation and spaces.
 */
export function browseLists(products: readonly Product[]): BrowseLists {
  const keyed = products.map(product => ({ product, key: normalize(product.n) }))
  keyed.sort((a, b) => {
    const ga = a.product.url ? 1 : 0
    const gb = b.product.url ? 1 : 0
    if (ga !== gb) {
      return ga - gb
    }
    return a.key.localeCompare(b.key, "nl")
  })
  const all = keyed.map(({ product }) => product)
  return {
    all,
    yes: all.filter(product => product.s === "yes"),
    no: all.filter(product => product.s === "no"),
  }
}
