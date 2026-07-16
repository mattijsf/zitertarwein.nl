import type { RefObject } from "react"
import { useCallback, useEffect, useRef } from "react"

const SMALL_SCREEN_MAX_WIDTH = 700
const DEBOUNCE_MS = 200
const MARGIN_BELOW = 24
const MARGIN_ABOVE = 12

/**
 * Insurance for tall keyboards: whenever the visual viewport changes while
 * typing, verify the field is fully visible; if it is (partially) behind the
 * keyboard, one native smooth scroll fixes exactly the measured overlap.
 * Debounced so it runs after the keyboard settles. Returns the input's focus
 * handler.
 */
export function useKeyboardAvoidance(inputRef: RefObject<HTMLInputElement | null>): () => void {
  const timer = useRef(0)

  const ensureFieldVisible = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const input = inputRef.current
      const vv = window.visualViewport
      if (!input || document.activeElement !== input || !vv) {
        return
      }
      const rect = input.getBoundingClientRect()
      const belowOverlap = rect.bottom - (vv.offsetTop + vv.height) + MARGIN_BELOW
      const aboveOverlap = vv.offsetTop - rect.top + MARGIN_ABOVE
      if (belowOverlap > 0) {
        window.scrollBy({ top: belowOverlap, behavior: "smooth" })
      } else if (aboveOverlap > 0) {
        window.scrollBy({ top: -aboveOverlap, behavior: "smooth" })
      }
    }, DEBOUNCE_MS)
  }, [inputRef])

  useEffect(() => {
    const vv = window.visualViewport
    const onResize = (): void => {
      if (
        document.activeElement === inputRef.current &&
        window.innerWidth <= SMALL_SCREEN_MAX_WIDTH
      ) {
        ensureFieldVisible()
      }
    }
    vv?.addEventListener("resize", onResize)
    return () => {
      vv?.removeEventListener("resize", onResize)
      clearTimeout(timer.current)
    }
  }, [inputRef, ensureFieldVisible])

  return useCallback(() => {
    if (window.innerWidth <= SMALL_SCREEN_MAX_WIDTH) {
      ensureFieldVisible()
    }
  }, [ensureFieldVisible])
}
