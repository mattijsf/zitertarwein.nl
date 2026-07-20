import { useEffect, useRef } from "react"
import { PRODUCTS } from "../../data/products"
import { findProduct } from "../../lib/findProduct"
import { readSharedTerm, shareSearch } from "../../lib/shareUrl"
import { useCatalogStore } from "../../stores/useCatalogStore"
import { useCheckStore } from "../../stores/useCheckStore"
import { sharedQuery } from "./sharedQuery"

/**
 * Keeps ?p=<product> in the address bar in step with the answer, and opens the answer for a
 * shared link on page load.
 */
export function useShareLink(): void {
  const result = useCheckStore(state => state.result)
  const name = sharedQuery(result)
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
  useEffect(() => {
    // Picking from the browse sheet pops its history entry after the answer is shown, which
    // lands on the entry before it, without ?p=. Put the answer's link back once there.
    const onPopState = (): void => {
      const query = sharedQuery(useCheckStore.getState().result)
      if (history.state === null && query !== null) {
        history.replaceState(null, "", shareSearch(query))
      }
    }
    window.addEventListener("popstate", onPopState)
    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

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
