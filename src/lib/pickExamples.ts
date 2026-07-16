import type { Product, Verdict } from "../types/product"
import { pickRandom } from "./pickRandom"

/** Only products with a story to tell, not the bare "Geen tarwe." ones. */
const MIN_INFO_LENGTH = 30
/** Below this many fresh products of a verdict, the recent list starts over. */
const MIN_POOL = 4

export interface ExamplePick {
  examples: Product[]
  /** Names shown recently, including these examples; pass back in on the next pick. */
  recent: ReadonlySet<string>
}

/**
 * Six "Probeer eens" products: two of each verdict, shuffled. Skips products shown recently, so
 * rerolls keep feeling fresh.
 */
export function pickExamples(
  products: readonly Product[],
  recentlyShown: ReadonlySet<string> = new Set(),
  random: () => number = Math.random
): ExamplePick {
  const recent = new Set(recentlyShown)
  const withStory = (s: Verdict): Product[] => {
    const all = products.filter(p => p.s === s && p.i.length > MIN_INFO_LENGTH)
    const fresh = all.filter(p => !recent.has(p.n))
    if (fresh.length < MIN_POOL) {
      recent.clear()
      return all
    }
    return fresh
  }
  const examples = pickRandom(
    [
      ...pickRandom(withStory("yes"), 2, random),
      ...pickRandom(withStory("no"), 2, random),
      ...pickRandom(withStory("check"), 2, random),
    ],
    6,
    random
  )
  for (const p of examples) {
    recent.add(p.n)
  }
  return { examples, recent }
}
