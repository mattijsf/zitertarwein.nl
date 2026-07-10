import type { Product } from "../types/product"
import { normalize } from "./normalize"

export interface Suggestion {
  product: Product
  /** The name or alias that matched, shown in the list. */
  name: string
  /** 0 = starts with the term, 1 = contains it. */
  score: number
}

const MAX_SUGGESTIONS = 7

export function suggest(term: string, products: readonly Product[]): Suggestion[] {
  const t = normalize(term)
  if (!t) {
    return []
  }
  const scored: Suggestion[] = []
  for (const product of products) {
    let best: Suggestion | undefined
    for (const name of [product.n, ...product.a]) {
      const n = normalize(name)
      let score: number
      if (n.startsWith(t)) {
        score = 0
      } else if (n.includes(t)) {
        score = 1
      } else {
        continue
      }
      if (!best || score < best.score) {
        best = { product, name, score }
      }
    }
    if (best) {
      scored.push(best)
    }
  }
  scored.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, "nl"))
  return scored.slice(0, MAX_SUGGESTIONS)
}
