import type { ReactElement } from "react"
import { useLayoutEffect, useRef, useState } from "react"
import type { BrowseLists, BrowseTab } from "../../lib/browseLists"
import { BROWSE_TABS } from "../../lib/browseLists"
import { useBrowseStore } from "../../stores/useBrowseStore"
import { useCheckStore } from "../../stores/useCheckStore"
import type { Product } from "../../types/product"
import { browseHistory } from "./browseHistory"
import { BrowseList } from "./BrowseList"
import { BrowseTabs } from "./BrowseTabs"

/** Rows rendered per batch; more are added as the list scrolls. */
const BROWSE_CHUNK = 60

interface Props {
  lists: BrowseLists
  open: boolean
}

/** Start rendering more rows this close (px) to the bottom of the list. */
const LOAD_MORE_MARGIN = 500

export function BrowsePanel({ lists, open }: Props): ReactElement {
  const tab = useBrowseStore(state => state.tab)
  const setTab = useBrowseStore(state => state.setTab)
  const showProduct = useCheckStore(state => state.showProduct)
  const [rendered, setRendered] = useState<Record<BrowseTab, number>>({
    all: BROWSE_CHUNK,
    yes: BROWSE_CHUNK,
    no: BROWSE_CHUNK,
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  // scroll position per tab, kept across tab switches and close/reopen
  const scrollTops = useRef<Record<BrowseTab, number>>({ all: 0, yes: 0, no: 0 })

  useLayoutEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollTops.current[tab]
    }
  }, [open, tab])

  const onScroll = (): void => {
    const el = scrollRef.current
    if (!el) {
      return
    }
    scrollTops.current[tab] = el.scrollTop
    const total = lists[tab].length
    if (
      rendered[tab] < total &&
      el.scrollTop + el.clientHeight > el.scrollHeight - LOAD_MORE_MARGIN
    ) {
      setRendered(r => ({ ...r, [tab]: Math.min(r[tab] + BROWSE_CHUNK, total) }))
    }
  }

  const pick = (product: Product): void => {
    showProduct(product, product.n)
    browseHistory.leave()
  }

  return (
    <div className="browse-panel">
      <div className="browse-head">
        <BrowseTabs lists={lists} active={tab} onSelect={setTab} />
        <button
          className="browse-close"
          type="button"
          aria-label="Sluiten"
          onClick={() => {
            browseHistory.back()
          }}
        >
          ✕
        </button>
      </div>
      <div ref={scrollRef} className="browse-scroll" onScroll={onScroll}>
        {BROWSE_TABS.map(key => (
          <BrowseList
            key={key}
            items={lists[key]}
            rendered={rendered[key]}
            hidden={key !== tab}
            onPick={pick}
          />
        ))}
      </div>
    </div>
  )
}
