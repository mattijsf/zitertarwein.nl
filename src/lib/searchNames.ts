import type { Product } from "../types/product"
import { normalize } from "./normalize"

export interface SearchName {
  /** The name or alias as written. */
  name: string
  /** The normalized form that search compares against. */
  key: string
  /** True when this alias is the product's brand. */
  isBrand: boolean
}

// Normalizing thousands of names on every keystroke adds up: do it once per product.
const cache = new WeakMap<Product, readonly SearchName[]>()

/** The product's name and aliases with their search keys. */
export function searchNames(product: Product): readonly SearchName[] {
  let names = cache.get(product)
  if (!names) {
    const brand = product.m ? normalize(product.m) : ""
    names = [product.n, ...product.a].map(name => {
      const key = normalize(name)
      return { name, key, isBrand: brand !== "" && key === brand }
    })
    cache.set(product, names)
  }
  return names
}
