import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import type { BrowseLists, BrowseTab } from "../../lib/browseLists"
import { browseLists } from "../../lib/browseLists"
import type { LetterBucket } from "../../lib/letterBuckets"
import { letterBuckets } from "../../lib/letterBuckets"
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
  buckets: Record<BrowseTab, readonly LetterBucket[]>
}

function build(id: number, products: readonly Product[]): Built {
  const lists = browseLists(products)
  const names = (tab: BrowseTab): string[] => lists[tab].map(product => product.n)
  return {
    id,
    from: products,
    lists,
    buckets: {
      all: letterBuckets(names("all")),
      yes: letterBuckets(names("yes")),
      no: letterBuckets(names("no")),
    },
  }
}

/** Bottom sheet listing every product. Built on first open, rebuilt on the next open after the
 * catalog grew (the supermarket list loads later). */
export function BrowseSheet(): ReactElement {
  const open = useBrowseStore(state => state.open)
  const hide = useBrowseStore(state => state.hide)
  const products = useCatalogStore(state => state.products)
  const [built, setBuilt] = useState<Built | null>(null)
  if (open && built?.from !== products) {
    setBuilt(build((built?.id ?? 0) + 1, products))
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
      {built && (
        <BrowsePanel key={built.id} lists={built.lists} buckets={built.buckets} open={open} />
      )}
    </div>
  )
}
