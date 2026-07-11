import { useMemo } from "react"
import type { Suggestion } from "../../lib/suggest"
import { suggest } from "../../lib/suggest"
import { useCatalogStore } from "../../stores/useCatalogStore"
import { useCheckStore } from "../../stores/useCheckStore"

/** Suggestions for the current query; empty while the list is closed. */
export function useSuggestions(): Suggestion[] {
  const query = useCheckStore(state => state.query)
  const open = useCheckStore(state => state.suggestionsOpen)
  const products = useCatalogStore(state => state.products)
  return useMemo(() => (open ? suggest(query, products) : []), [open, query, products])
}
