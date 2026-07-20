import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import type { BrowseLists } from "../../lib/browseLists"
import { browseLists } from "../../lib/browseLists"
import { useBrowseStore } from "../../stores/useBrowseStore"
import { useCatalogStore } from "../../stores/useCatalogStore"
import type { Product } from "../../types/product"
import { BrowsePanel } from "./BrowsePanel"
import "./BrowseSheet.css"
import { browseHistory } from "./browseHistory"

interface Built {
  id: number
  from: readonly Product[]
  lists: BrowseLists
}

/** Bottom sheet listing every product. Built on first open, rebuilt on the next open after the
 * catalog grew (the supermarket list loads later). */
export function BrowseSheet(): ReactElement {
  const open = useBrowseStore(state => state.open)
  const hide = useBrowseStore(state => state.hide)
  const products = useCatalogStore(state => state.products)
  const [built, setBuilt] = useState<Built | null>(null)
  if (open && built?.from !== products) {
    setBuilt({ id: (built?.id ?? 0) + 1, from: products, lists: browseLists(products) })
  }

  useEffect(() => {
    // hardware back (or browseHistory.back) pops the sheet's history entry
    const onPopState = (): void => {
      hide()
    }
    window.addEventListener("popstate", onPopState)
    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [hide])

  return (
    <div
      className="browse"
      hidden={!open}
      aria-label="Productenlijst"
      onClick={event => {
        if (event.target === event.currentTarget) {
          browseHistory.back()
        }
      }}
    >
      {built && <BrowsePanel key={built.id} lists={built.lists} open={open} />}
    </div>
  )
}
