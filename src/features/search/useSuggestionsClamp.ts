import type { RefObject } from "react"
import { useCallback, useEffect, useLayoutEffect } from "react"

const VIEW_MARGIN = 12
const MIN_HEIGHT = 64

/**
 * Caps the open suggestion list to the space the on-screen keyboard leaves
 * (visualViewport) and lets it scroll internally. Returns the clamp, so a
 * page scroll can re-run it.
 */
export function useSuggestionsClamp(
  listRef: RefObject<HTMLUListElement | null>,
  open: boolean,
  items: unknown
): () => void {
  const clamp = useCallback((): void => {
    const list = listRef.current
    if (!list?.classList.contains("open")) {
      return
    }
    const vv = window.visualViewport
    const viewBottom = vv ? vv.offsetTop + vv.height : window.innerHeight
    const space = viewBottom - list.getBoundingClientRect().top - VIEW_MARGIN
    list.style.maxHeight = `${Math.max(MIN_HEIGHT, space)}px`
    list.style.overflowY = "auto"
  }, [listRef])

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

  return clamp
}
