import type { Product, Verdict } from "../types/product"
import { pickRandom } from "./pickRandom"

/** Only products with a story to tell, not the bare "Geen tarwe." ones. */
const MIN_INFO_LENGTH = 30

/** Six "Probeer eens" products: two of each verdict, shuffled. */
export function pickExamples(
  products: readonly Product[],
  random: () => number = Math.random
): Product[] {
  const withStory = (s: Verdict): Product[] =>
    products.filter(p => p.s === s && p.i.length > MIN_INFO_LENGTH)
  return pickRandom(
    [
      ...pickRandom(withStory("yes"), 2, random),
      ...pickRandom(withStory("no"), 2, random),
      ...pickRandom(withStory("check"), 2, random),
    ],
    6,
    random
  )
}
