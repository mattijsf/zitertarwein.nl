import { create } from "zustand"
import { decodeEntities } from "../lib/decodeEntities"
import { findProduct } from "../lib/findProduct"
import type { InstallPlatform } from "../lib/installPlatform"
import { lookUpBarcode } from "../lib/lookUpBarcode"
import type { OnlineMatch } from "../lib/lookUpOnline"
import { lookUpOnline, toMatch } from "../lib/lookUpOnline"
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
  /** A scanned barcode Open Food Facts does not know. */
  | { kind: "barcodeUnknown"; code: string }
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
  /** Fills the field without opening the suggestions. */
  setQuery: (query: string) => void
  openSuggestions: () => void
  closeSuggestions: () => void
  setActiveIndex: (index: number) => void
  /** Look up the query (or a given term) and show the result. */
  check: (term?: string) => void
  choose: (suggestion: Suggestion) => void
  /** Look up a scanned barcode on Open Food Facts. */
  checkBarcode: (code: string) => void
  showInstallHelp: (platform: InstallPlatform) => void
  /** Wipes the result and the query, and drops a pending online lookup. */
  clear: () => void
}

export const useCheckStore = create<CheckState>()((set, get) => {
  /** Shows a result; the new resultId makes the card replay its entry animation. */
  const show = (result: CheckResult): void => {
    set({ result, resultId: get().resultId + 1 })
  }

  return {
    query: "",
    suggestionsOpen: false,
    activeIndex: -1,
    result: null,
    resultId: 0,

    type: query => {
      set({ query, suggestionsOpen: true, activeIndex: -1 })
    },
    setQuery: query => {
      set({ query })
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
        // No exact match: take the first prefix suggestion, or fix a typo.
        const first = suggest(term, products)[0]
        if (first && (first.score === 0 || first.score >= 2)) {
          product = first.product
          query = first.name
        }
      }
      const search = ++searchCounter
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
      })
      show({ kind: "product", product: suggestion.product })
    },

    checkBarcode: code => {
      const search = ++searchCounter
      const term = `barcode ${code}`
      show({ kind: "searching", term })
      void lookUpBarcode(code).then(lookup => {
        if (search !== searchCounter) {
          return
        }
        switch (lookup.kind) {
          case "found": {
            const { product } = lookup
            const name = decodeEntities(product.productNameNl || product.productName || code)
            set({ query: name })
            show({ kind: "online", term: name, match: toMatch(product, name) })
            break
          }
          case "unknown":
            show({ kind: "barcodeUnknown", code })
            break
          case "unavailable":
            show({ kind: "unavailable", term })
            break
        }
      })
    },

    showInstallHelp: platform => {
      searchCounter++
      show({ kind: "installHelp", platform })
    },

    clear: () => {
      searchCounter++
      set({ query: "", suggestionsOpen: false, activeIndex: -1, result: null })
    },
  }
})
