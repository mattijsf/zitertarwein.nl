import { useEffect, useRef } from "react"
import { PRODUCTS } from "../../data/products"
import { findProduct } from "../../lib/findProduct"
import { readSharedTerm, shareSearch } from "../../lib/shareUrl"
import { useCatalogStore } from "../../stores/useCatalogStore"
import type { CheckResult } from "../../stores/useCheckStore"
import { useCheckStore } from "../../stores/useCheckStore"

/** The product an answer can be shared as, or null for cards without an answer. */
function sharedName(result: CheckResult | null): string | null {
  if (result?.kind === "product") {
    return result.product.n
  }
  return result?.kind === "online" ? result.term : null
}

/**
 * Keeps ?p=<product> in the address bar in step with the answer, and opens the answer for a
 * shared link on page load.
 */
export function useShareLink(): void {
  const result = useCheckStore(state => state.result)
  const name = sharedName(result)
  const hadResult = useRef(false)
  useEffect(() => {
    if (result === null) {
      // cleared: drop ?p= (but leave a shared link alone until it has been opened)
      if (hadResult.current) {
        history.replaceState(null, "", location.pathname)
      }
      return
    }
    hadResult.current = true
    if (name !== null) {
      history.replaceState(null, "", shareSearch(name))
    }
  }, [result, name])

  const opened = useRef(false)
  useEffect(() => {
    const term = readSharedTerm(location.search)
    if (term === null || opened.current) {
      return
    }
    const open = (): void => {
      opened.current = true
      useCheckStore.getState().check(term)
    }
    useCheckStore.getState().setQuery(term)
    // the supermarket list may still be loading
    if (findProduct(term, PRODUCTS) || useCatalogStore.getState().offSettled) {
      open()
      return
    }
    return useCatalogStore.subscribe(state => {
      if (state.offSettled && !opened.current) {
        open()
      }
    })
  }, [])
}
