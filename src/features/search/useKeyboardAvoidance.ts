import type { RefObject } from "react"
import { useCallback, useEffect, useRef } from "react"

const SMALL_SCREEN_MAX_WIDTH = 700
const KEYBOARD_SETTLE_MS = 400

/**
 * Insurance for tall keyboards: if the field ends up outside the visible area
 * after the keyboard opened, ask the browser (once, natively) to bring it back
 * into view. No custom animation, so nothing to fight. Returns the input's
 * focus handler.
 */
export function useKeyboardAvoidance(inputRef: RefObject<HTMLInputElement | null>): () => void {
  const timer = useRef(0)
  useEffect(
    () => () => {
      clearTimeout(timer.current)
    },
    []
  )

  return useCallback(() => {
    if (window.innerWidth > SMALL_SCREEN_MAX_WIDTH) {
      return
    }
    clearTimeout(timer.current)
    // after the keyboard has settled
    timer.current = window.setTimeout(() => {
      const input = inputRef.current
      const vv = window.visualViewport
      if (!input || document.activeElement !== input || !vv) {
        return
      }
      const rect = input.getBoundingClientRect()
      if (rect.bottom > vv.offsetTop + vv.height || rect.top < vv.offsetTop) {
        input.scrollIntoView({ block: "center", behavior: "smooth" })
      }
    }, KEYBOARD_SETTLE_MS)
  }, [inputRef])
}
