import type { Product } from "../types/product"

export interface VerdictCounts {
  total: number
  yes: number
  no: number
}

/** How many products there are, and how many of them contain wheat or are free of it. */
export function countVerdicts(products: readonly Product[]): VerdictCounts {
  let yes = 0
  let no = 0
  for (const p of products) {
    if (p.s === "yes") {
      yes++
    } else if (p.s === "no") {
      no++
    }
  }
  return { total: products.length, yes, no }
}
