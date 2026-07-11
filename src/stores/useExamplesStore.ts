import { create } from "zustand"
import { PRODUCTS } from "../data/products"
import { pickExamples } from "../lib/pickExamples"
import type { Product } from "../types/product"

interface ExamplesState {
  /** "Probeer eens" products, also used by the rotating placeholder. New on every page load. */
  examples: Product[]
}

export const useExamplesStore = create<ExamplesState>()(() => ({
  examples: pickExamples(PRODUCTS),
}))
