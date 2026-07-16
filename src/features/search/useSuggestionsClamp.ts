import type { RefObject } from "react"
import { useCallback, useEffect, useLayoutEffect } from "react"

const VIEW_MARGIN = 22
const MIN_HEIGHT = 64
const ROOM_BELOW = 170

/**
 * Keeps the open suggestion list visible above the mobile keyboard without
 * scrolling the page (every browser fights that differently): when the
 * keyboard leaves too little room below the search box, the list opens
 * upward. Either way it is capped to the space in the visual viewport and
 * scrolls internally.
 */
export function useSuggestionsClamp(
  listRef: RefObject<HTMLUListElement | null>,
  boxRef: RefObject<HTMLElement | null>,
  open: boolean,
  items: unknown
): void {
  const clamp = useCallback((): void => {
    const list = listRef.current
    const box = boxRef.current
    if (!list?.classList.contains("open") || !box) {
      return
    }
    const vv = window.visualViewport
    const vvTop = vv ? vv.offsetTop : 0
    const vvBottom = vv ? vv.offsetTop + vv.height : window.innerHeight
    const rect = box.getBoundingClientRect()
    const below = vvBottom - rect.bottom - VIEW_MARGIN
    const above = rect.top - vvTop - VIEW_MARGIN
    if (below >= ROOM_BELOW || below >= above) {
      list.dataset.placement = "below"
      list.style.maxHeight = `${Math.max(MIN_HEIGHT, below)}px`
    } else {
      list.dataset.placement = "above"
      list.style.maxHeight = `${Math.max(MIN_HEIGHT, above)}px`
    }
    list.style.overflowY = "auto"
  }, [listRef, boxRef])

  // every time the list renders new items
  useLayoutEffect(() => {
    clamp()
  }, [clamp, open, items])

  useEffect(() => {
    if (!open) {
      return
    }
    const vv = window.visualViewport
    vv?.addEventListener("resize", clamp)
    vv?.addEventListener("scroll", clamp)
    window.addEventListener("scroll", clamp, { passive: true })
    return () => {
      vv?.removeEventListener("resize", clamp)
      vv?.removeEventListener("scroll", clamp)
      window.removeEventListener("scroll", clamp)
    }
  }, [open, clamp])
}
