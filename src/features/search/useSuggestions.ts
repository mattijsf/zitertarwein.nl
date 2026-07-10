import { useMemo } from "react"
import { PRODUCTS } from "../../data/products"
import type { Suggestion } from "../../lib/suggest"
import { suggest } from "../../lib/suggest"
import { useCheckStore } from "../../stores/useCheckStore"

/** Suggestions for the current query; empty while the list is closed. */
export function useSuggestions(): Suggestion[] {
  const query = useCheckStore(state => state.query)
  const open = useCheckStore(state => state.suggestionsOpen)
  return useMemo(() => (open ? suggest(query, PRODUCTS) : []), [open, query])
}
