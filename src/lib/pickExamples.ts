import type { Product, Verdict } from "../types/product"
import { pickRandom } from "./pickRandom"

/** Only products with a story to tell, not the bare "Geen tarwe." ones. */
const MIN_INFO_LENGTH = 30

/** Three "Probeer eens" products: one of each verdict, so three chips show the full range. */
export function pickExamples(
  products: readonly Product[],
  random: () => number = Math.random
): Product[] {
  const withStory = (s: Verdict): Product[] =>
    products.filter(p => p.s === s && p.i.length > MIN_INFO_LENGTH)
  return pickRandom(
    [
      ...pickRandom(withStory("yes"), 1, random),
      ...pickRandom(withStory("no"), 1, random),
      ...pickRandom(withStory("check"), 1, random),
    ],
    3,
    random
  )
}
