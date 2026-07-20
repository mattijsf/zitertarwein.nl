import type { RefObject } from "react"
import { useEffect, useEffectEvent } from "react"

/**
 * Tap or drag on the A-Z bar: reports the finger's (or click's) Y position. Native listeners
 * because React's touch listeners are passive and can't stop the page from scrolling.
 */
export function useIndexScrub(
  barRef: RefObject<HTMLElement | null>,
  onScrub: (clientY: number) => void
): void {
  const scrub = useEffectEvent(onScrub)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) {
      return
    }
    const onClick = (e: MouseEvent): void => {
      scrub(e.clientY)
    }
    const onTouch = (e: TouchEvent): void => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        scrub(touch.clientY)
      }
    }
    bar.addEventListener("click", onClick)
    bar.addEventListener("touchstart", onTouch, { passive: false })
    bar.addEventListener("touchmove", onTouch, { passive: false })
    return () => {
      bar.removeEventListener("click", onClick)
      bar.removeEventListener("touchstart", onTouch)
      bar.removeEventListener("touchmove", onTouch)
    }
  }, [barRef])
}
