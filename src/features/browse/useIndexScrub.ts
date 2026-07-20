import type { RefObject } from "react"
import { useEffect, useEffectEvent } from "react"

interface Handlers {
  /** The finger's (or mouse's) Y position. */
  onScrub: (clientY: number) => void
  /** Finger lifted or mouse released. */
  onEnd: () => void
}

function clientY(e: MouseEvent | TouchEvent): number | undefined {
  return "touches" in e ? e.touches[0]?.clientY : e.clientY
}

/**
 * Scrubbing works from either edge: the A-Z bar on the right and an invisible zone on the left.
 * Once a scrub starts, tracking moves to the document so the finger can drift anywhere; only its
 * Y position matters. Native listeners because React's touch listeners are passive and can't
 * stop the page from scrolling.
 */
export function useIndexScrub(
  barRef: RefObject<HTMLElement | null>,
  leftRef: RefObject<HTMLElement | null>,
  handlers: Handlers
): void {
  const scrub = useEffectEvent(handlers.onScrub)
  const end = useEffectEvent(handlers.onEnd)
  useEffect(() => {
    const zones = [barRef.current, leftRef.current].filter(zone => zone !== null)
    let scrubbing = false

    const scrubTo = (e: MouseEvent | TouchEvent): void => {
      const y = clientY(e)
      if (y !== undefined) {
        scrub(y)
      }
    }
    const onMove = (e: MouseEvent | TouchEvent): void => {
      if (!scrubbing) {
        return
      }
      if (e.cancelable) {
        e.preventDefault()
      }
      scrubTo(e)
    }
    const stopTracking = (): void => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("touchmove", onMove)
      document.removeEventListener("mouseup", onEnd)
      document.removeEventListener("touchend", onEnd)
      document.removeEventListener("touchcancel", onEnd)
    }
    function onEnd(): void {
      scrubbing = false
      end()
      stopTracking()
    }
    const onStart = (e: MouseEvent | TouchEvent): void => {
      if (e.cancelable) {
        e.preventDefault()
      }
      scrubbing = true
      scrubTo(e)
      document.addEventListener("mousemove", onMove)
      document.addEventListener("touchmove", onMove, { passive: false })
      document.addEventListener("mouseup", onEnd)
      document.addEventListener("touchend", onEnd)
      document.addEventListener("touchcancel", onEnd)
    }

    for (const zone of zones) {
      zone.addEventListener("mousedown", onStart)
      zone.addEventListener("touchstart", onStart, { passive: false })
    }
    return () => {
      for (const zone of zones) {
        zone.removeEventListener("mousedown", onStart)
        zone.removeEventListener("touchstart", onStart)
      }
      stopTracking()
    }
  }, [barRef, leftRef])
}
