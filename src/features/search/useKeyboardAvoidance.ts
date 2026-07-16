import type { RefObject } from "react"
import { useCallback, useEffect, useRef } from "react"

const SMALL_SCREEN_MAX_WIDTH = 700
const PARK_MARGIN = 10
const POLL_MS = 60
const QUIET_MS = 220
const MAX_WAIT_MS = 1400
const MIN_PARK_DISTANCE = 6
const SMOOTH_SCROLL_MS = 450

export interface KeyboardAvoidance {
  onFocus: () => void
  onBlur: () => void
}

/**
 * On small screens, parks the search bar at the top of the visible area when
 * typing starts, so the suggestions get the room between the input and the
 * keyboard. Returns the input's focus and blur handlers.
 */
export function useKeyboardAvoidance(
  inputRef: RefObject<HTMLInputElement | null>,
  wrapRef: RefObject<HTMLElement | null>,
  clampSuggestions: () => void
): KeyboardAvoidance {
  const parkTimer = useRef(0)
  const clampTimer = useRef(0)
  const lastShift = useRef(0)

  // remember when the viewport last moved (keyboard slide, focus scrolling)
  useEffect(() => {
    const noteShift = (): void => {
      lastShift.current = performance.now()
    }
    const vv = window.visualViewport
    vv?.addEventListener("resize", noteShift)
    vv?.addEventListener("scroll", noteShift)
    window.addEventListener("scroll", noteShift, { passive: true })
    return () => {
      vv?.removeEventListener("resize", noteShift)
      vv?.removeEventListener("scroll", noteShift)
      window.removeEventListener("scroll", noteShift)
      clearInterval(parkTimer.current)
      clearTimeout(clampTimer.current)
    }
  }, [])

  const cancelPark = useCallback(() => {
    clearInterval(parkTimer.current)
  }, [])

  // Park only after the viewport has settled (keyboard slide and the
  // browser's own focus scrolling done), with one native smooth scroll: no
  // frame-by-frame corrections fighting the browser, so no judder (Firefox).
  const parkSearchBar = useCallback(() => {
    cancelPark()
    const started = performance.now()
    lastShift.current = started
    parkTimer.current = window.setInterval(() => {
      const wrap = wrapRef.current
      if (document.activeElement !== inputRef.current || !wrap) {
        cancelPark()
        return
      }
      const now = performance.now()
      if (now - lastShift.current <= QUIET_MS && now - started <= MAX_WAIT_MS) {
        return // still moving
      }
      cancelPark()
      const vvTop = window.visualViewport?.offsetTop ?? 0
      const d = wrap.getBoundingClientRect().top - vvTop - PARK_MARGIN
      if (Math.abs(d) > MIN_PARK_DISTANCE) {
        window.scrollTo({ top: window.scrollY + d, behavior: "smooth" })
      }
      clearTimeout(clampTimer.current)
      clampTimer.current = window.setTimeout(clampSuggestions, SMOOTH_SCROLL_MS)
    }, POLL_MS)
  }, [inputRef, wrapRef, clampSuggestions, cancelPark])

  const onFocus = useCallback(() => {
    if (window.innerWidth <= SMALL_SCREEN_MAX_WIDTH) {
      parkSearchBar()
    }
  }, [parkSearchBar])

  return { onFocus, onBlur: cancelPark }
}
