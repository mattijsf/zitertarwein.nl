import type { RefObject } from "react"
import { useEffect, useEffectEvent } from "react"

/** After a tap (click), the letter and bubble stay up this long. */
const TAP_LINGER_MS = 320

interface Handlers {
  /** The finger's (or click's) Y position. */
  onScrub: (clientY: number) => void
  /** Finger lifted, or a short while after a tap. */
  onEnd: () => void
}

/**
 * Tap or drag on the A-Z bar. Native listeners because React's touch listeners are passive and
 * can't stop the page from scrolling.
 */
export function useIndexScrub(barRef: RefObject<HTMLElement | null>, handlers: Handlers): void {
  const scrub = useEffectEvent(handlers.onScrub)
  const end = useEffectEvent(handlers.onEnd)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) {
      return
    }
    let tapTimer: ReturnType<typeof setTimeout> | undefined
    const onClick = (e: MouseEvent): void => {
      scrub(e.clientY)
      tapTimer = setTimeout(() => {
        end()
      }, TAP_LINGER_MS)
    }
    const onTouch = (e: TouchEvent): void => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        scrub(touch.clientY)
      }
    }
    const onTouchEnd = (): void => {
      end()
    }
    bar.addEventListener("click", onClick)
    bar.addEventListener("touchstart", onTouch, { passive: false })
    bar.addEventListener("touchmove", onTouch, { passive: false })
    bar.addEventListener("touchend", onTouchEnd)
    bar.addEventListener("touchcancel", onTouchEnd)
    return () => {
      clearTimeout(tapTimer)
      bar.removeEventListener("click", onClick)
      bar.removeEventListener("touchstart", onTouch)
      bar.removeEventListener("touchmove", onTouch)
      bar.removeEventListener("touchend", onTouchEnd)
      bar.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [barRef])
}
