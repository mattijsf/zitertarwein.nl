import type { Product } from "../types/product"
import { normalize } from "./normalize"

export type BrowseTab = "all" | "yes" | "no"

export const BROWSE_TABS: readonly BrowseTab[] = ["all", "yes", "no"]

export type BrowseLists = Record<BrowseTab, readonly Product[]>

/** The browse tabs: everything, contains wheat, wheat-free. Alphabetical, ignoring case,
 * punctuation and spaces. */
export function browseLists(products: readonly Product[]): BrowseLists {
  const keyed = products.map(product => ({ product, key: normalize(product.n) }))
  keyed.sort((a, b) => a.key.localeCompare(b.key, "nl"))
  const all = keyed.map(({ product }) => product)
  return {
    all,
    yes: all.filter(product => product.s === "yes"),
    no: all.filter(product => product.s === "no"),
  }
}
