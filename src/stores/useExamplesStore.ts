import { create } from "zustand"
import { PRODUCTS } from "../data/products"
import { pickExamples } from "../lib/pickExamples"
import type { Product } from "../types/product"

interface ExamplesState {
  /** "Probeer eens" products, also used by the rotating placeholder. New on every page load. */
  examples: Product[]
  /** Recently shown examples, left out of the next rerolls. */
  recent: ReadonlySet<string>
  /** Goes up per reroll, so the chips remount and pop in again. */
  rollId: number
  reroll: () => void
}

export const useExamplesStore = create<ExamplesState>()((set, get) => ({
  ...pickExamples(PRODUCTS),
  rollId: 0,
  reroll: () => {
    set({ ...pickExamples(PRODUCTS, get().recent), rollId: get().rollId + 1 })
  },
}))
