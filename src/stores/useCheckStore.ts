import { create } from "zustand"
import { findProduct } from "../lib/findProduct"
import type { InstallPlatform } from "../lib/installPlatform"
import type { OnlineMatch } from "../lib/lookUpOnline"
import { lookUpOnline } from "../lib/lookUpOnline"
import { normalize } from "../lib/normalize"
import type { Suggestion } from "../lib/suggest"
import { suggest } from "../lib/suggest"
import type { Product } from "../types/product"
import { useCatalogStore } from "./useCatalogStore"

export type CheckResult =
  | { kind: "product"; product: Product }
  /** Not in our list: looking it up on Open Food Facts. */
  | { kind: "searching"; term: string }
  | { kind: "online"; term: string; match: OnlineMatch }
  /** Not on Open Food Facts either. */
  | { kind: "notFound"; term: string }
  /** Open Food Facts did not answer: an outage, not "not found". */
  | { kind: "unavailable"; term: string }
  /** How to install the app, for browsers without an install prompt. */
  | { kind: "installHelp"; platform: InstallPlatform }

/** Bumped per lookup, so a slow answer for an older term is dropped. */
let searchCounter = 0

interface CheckState {
  query: string
  suggestionsOpen: boolean
  /** Keyboard-highlighted suggestion, -1 for none. */
  activeIndex: number
  result: CheckResult | null
  /** Goes up with every shown result, so the card can replay its entry animation. */
  resultId: number

  /** Typing in the field: updates the query and opens the suggestions. */
  type: (query: string) => void
  openSuggestions: () => void
  closeSuggestions: () => void
  setActiveIndex: (index: number) => void
  /** Look up the query (or a given term) and show the result. */
  check: (term?: string) => void
  choose: (suggestion: Suggestion) => void
  showInstallHelp: (platform: InstallPlatform) => void
}

export const useCheckStore = create<CheckState>()((set, get) => ({
  query: "",
  suggestionsOpen: false,
  activeIndex: -1,
  result: null,
  resultId: 0,

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
    const { products } = useCatalogStore.getState()
    let query = term
    let product = findProduct(term, products)
    if (!product) {
      // No exact match: take the first suggestion that starts with the input.
      const first = suggest(term, products)[0]
      if (first?.score === 0) {
        product = first.product
        query = first.name
      }
    }
    const search = ++searchCounter
    const show = (result: CheckResult): void => {
      set({ result, resultId: get().resultId + 1 })
    }
    set({ query, suggestionsOpen: false, activeIndex: -1 })
    if (product) {
      show({ kind: "product", product })
      return
    }
    show({ kind: "searching", term })
    void lookUpOnline(term, () => search === searchCounter).then(lookup => {
      switch (lookup?.kind) {
        case "found":
          show({ kind: "online", term, match: lookup.match })
          break
        case "notFound":
        case "unavailable":
          show({ kind: lookup.kind, term })
          break
        case undefined:
          // stale: the user searched for something else meanwhile
          break
      }
    })
  },

  choose: suggestion => {
    searchCounter++
    set({
      query: suggestion.name,
      suggestionsOpen: false,
      activeIndex: -1,
      result: { kind: "product", product: suggestion.product },
      resultId: get().resultId + 1,
    })
  },

  showInstallHelp: platform => {
    searchCounter++
    set({ result: { kind: "installHelp", platform }, resultId: get().resultId + 1 })
  },
}))
