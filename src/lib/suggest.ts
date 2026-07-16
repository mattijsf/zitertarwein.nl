import type { Product } from "../types/product"
import { editDistance } from "./editDistance"
import { normalize } from "./normalize"
import { searchNames } from "./searchNames"

export interface Suggestion {
  product: Product
  /** The name or alias that matched, shown in the list. */
  name: string
  /** 0 = starts with the term, 1 = contains it, 2 + edit distance = typo match. */
  score: number
}

const MAX_SUGGESTIONS = 7
/** Shorter terms are too ambiguous for typo matching. */
const MIN_TYPO_LENGTH = 4

export function suggest(term: string, products: readonly Product[]): Suggestion[] {
  const t = normalize(term)
  if (!t) {
    return []
  }
  const scored: Suggestion[] = []
  const seen = new Set<Product>()
  for (const product of products) {
    let best: Suggestion | undefined
    for (const { name, key, isBrand } of searchNames(product)) {
      let score: number
      if (key.startsWith(t)) {
        score = 0
      } else if (key.includes(t)) {
        score = 1
      } else {
        continue
      }
      if (!best || score < best.score) {
        // brand match: show the full product name, not just the brand
        best = { product, name: isBrand ? product.n : name, score }
      }
    }
    if (best) {
      scored.push(best)
      seen.add(product)
    }
  }
  // Typo matches join in, ranked after the regular hits, but only when those don't already
  // fill the list, so normal typing skips the expensive pass.
  if (t.length >= MIN_TYPO_LENGTH && scored.length < MAX_SUGGESTIONS) {
    scored.push(...suggestTypos(t, products, seen))
  }
  scored.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, "nl"))
  return scored.slice(0, MAX_SUGGESTIONS)
}

/** Tolerate typos ("stropwafel" finds stroopwafel); products in `skip` already matched. */
function suggestTypos(
  t: string,
  products: readonly Product[],
  skip: ReadonlySet<Product>
): Suggestion[] {
  const max = t.length >= 8 ? 2 : 1
  const found: Suggestion[] = []
  for (const product of products) {
    if (skip.has(product)) {
      continue
    }
    for (const { name, key, isBrand } of searchNames(product)) {
      const d = Math.min(editDistance(t, key, max), editDistance(t, key.slice(0, t.length), max))
      if (d <= max) {
        found.push({ product, name: isBrand ? product.n : name, score: 2 + d })
        break
      }
    }
  }
  return found
}
