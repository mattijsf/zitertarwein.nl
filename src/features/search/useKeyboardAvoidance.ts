import type { RefObject } from "react"
import { useCallback, useEffect, useRef } from "react"

const SMALL_SCREEN_MAX_WIDTH = 700
const KEYBOARD_SLIDE_MS = 300
const PARK_MARGIN = 10

/**
 * On small screens, parks the search bar at the top when typing starts, so the
 * suggestions get the room between the input and the keyboard. Returns the
 * input's focus handler.
 */
export function useKeyboardAvoidance(
  inputRef: RefObject<HTMLInputElement | null>,
  wrapRef: RefObject<HTMLElement | null>,
  clampSuggestions: () => void
): () => void {
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
    // wait for the keyboard to slide in
    timer.current = window.setTimeout(() => {
      const wrap = wrapRef.current
      if (document.activeElement !== inputRef.current || !wrap) {
        return
      }
      // Instant scroll: a smooth one gets cancelled by the browser's own
      // focus scrolling while the keyboard slides in.
      const y = window.scrollY + wrap.getBoundingClientRect().top - PARK_MARGIN
      window.scrollTo(0, y)
      clampSuggestions()
    }, KEYBOARD_SLIDE_MS)
  }, [inputRef, wrapRef, clampSuggestions])
}
