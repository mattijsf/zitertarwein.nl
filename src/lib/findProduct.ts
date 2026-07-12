import type { Product } from "../types/product"
import { normalize } from "./normalize"
import { searchNames } from "./searchNames"

/** Exact match on the name or one of the aliases. */
export function findProduct(term: string, products: readonly Product[]): Product | undefined {
  const t = normalize(term)
  if (!t) {
    return undefined
  }
  return products.find(p => searchNames(p).some(({ key }) => key === t))
}
