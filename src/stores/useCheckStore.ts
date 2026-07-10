import { create } from "zustand"
import { PRODUCTS } from "../data/products"
import { findProduct } from "../lib/findProduct"
import { normalize } from "../lib/normalize"
import type { Suggestion } from "../lib/suggest"
import { suggest } from "../lib/suggest"
import type { Product } from "../types/product"

export type CheckResult = { kind: "product"; product: Product } | { kind: "unknown"; term: string }

interface CheckState {
  query: string
  suggestionsOpen: boolean
  /** Keyboard-highlighted suggestion, -1 for none. */
  activeIndex: number
  result: CheckResult | null

  /** Typing in the field: updates the query and opens the suggestions. */
  type: (query: string) => void
  openSuggestions: () => void
  closeSuggestions: () => void
  setActiveIndex: (index: number) => void
  /** Look up the query (or a given term) and show the result. */
  check: (term?: string) => void
  choose: (suggestion: Suggestion) => void
}

export const useCheckStore = create<CheckState>()((set, get) => ({
  query: "",
  suggestionsOpen: false,
  activeIndex: -1,
  result: null,

  type: query => {
    set({ query, suggestionsOpen: true, activeIndex: -1 })
  },
  openSuggestions: () => {
    set({ suggestionsOpen: true, activeIndex: -1 })
  },
  closeSuggestions: () => {
    set({ suggestionsOpen: false, activeIndex: -1 })
  },
  setActiveIndex: activeIndex => {
    set({ activeIndex })
  },

  check: (term = get().query) => {
    if (!normalize(term)) {
      return
    }
    let query = term
    let product = findProduct(term, PRODUCTS)
    if (!product) {
      // No exact match: take the first suggestion that starts with the input.
      const first = suggest(term, PRODUCTS)[0]
      if (first?.score === 0) {
        product = first.product
        query = first.name
      }
    }
    set({
      query,
      suggestionsOpen: false,
      activeIndex: -1,
      result: product ? { kind: "product", product } : { kind: "unknown", term },
    })
  },

  choose: suggestion => {
    set({
      query: suggestion.name,
      suggestionsOpen: false,
      activeIndex: -1,
      result: { kind: "product", product: suggestion.product },
    })
  },
}))
