import type { RefObject } from "react"
import { useCallback, useEffect, useRef } from "react"

const SMALL_SCREEN_MAX_WIDTH = 700
const KEYBOARD_SLIDE_MS = 300
const PARK_MARGIN = 10
const GLIDE_MAX_MS = 700
const SAFETY_NET_EXTRA_MS = 200
const EASE_MS = 90

export interface KeyboardAvoidance {
  onFocus: () => void
  onBlur: () => void
}

/**
 * On small screens, parks the search bar at the top when typing starts, so the
 * suggestions get the room between the input and the keyboard. Returns the
 * input's focus and blur handlers.
 */
export function useKeyboardAvoidance(
  inputRef: RefObject<HTMLInputElement | null>,
  wrapRef: RefObject<HTMLElement | null>,
  clampSuggestions: () => void
): KeyboardAvoidance {
  const timer = useRef(0)
  const safetyNet = useRef(0)
  const frame = useRef(0)
  const glideStop = useRef(false)
  const glideId = useRef(0)

  // the user taking over (touch/wheel) aborts the glide
  useEffect(() => {
    const stop = (): void => {
      glideStop.current = true
    }
    window.addEventListener("touchmove", stop, { passive: true })
    window.addEventListener("wheel", stop, { passive: true })
    return () => {
      window.removeEventListener("touchmove", stop)
      window.removeEventListener("wheel", stop)
      clearTimeout(timer.current)
      clearTimeout(safetyNet.current)
      cancelAnimationFrame(frame.current)
    }
  }, [])

  // Converging glide: every frame moves a fraction toward the element's
  // CURRENT position. Self-correcting when the browser scrolls on its own
  // mid-animation (Firefox does after focus), so it cannot overshoot. The
  // browser's native smooth scrolling gets cancelled by its own focus
  // handling, so we drive it ourselves.
  const glideTo = useCallback(
    (el: HTMLElement, offset = PARK_MARGIN, maxMs = GLIDE_MAX_MS): void => {
      glideStop.current = false
      const id = ++glideId.current // a newer glide takes over from an older one
      const start = performance.now()
      // Measure against the VISUAL viewport top: Firefox pans it down when the
      // keyboard opens without resizing the layout viewport, so layout
      // coordinates alone would put the bar above the visible area.
      const distance = (): number =>
        el.getBoundingClientRect().top - ((window.visualViewport?.offsetTop ?? 0) + offset)
      const settle = (): void => {
        const d = distance()
        if (Math.abs(d) > 2) {
          window.scrollBy(0, d)
        }
        clampSuggestions()
      }
      // Safety net: if animation frames never run (throttled background
      // view), still end up in the right place.
      const net = window.setTimeout(() => {
        if (!glideStop.current && id === glideId.current) {
          settle()
        }
      }, maxMs + SAFETY_NET_EXTRA_MS)
      safetyNet.current = net
      let prev = start
      const step = (now: number): void => {
        if (glideStop.current || id !== glideId.current) {
          clearTimeout(net)
          return
        }
        const d = distance()
        if (Math.abs(d) < 1 || now - start > maxMs) {
          clearTimeout(net)
          settle()
          return
        }
        const dt = now - prev
        prev = now
        window.scrollBy(0, d * (1 - Math.exp(-dt / EASE_MS))) // exponential ease-out
        frame.current = requestAnimationFrame(step)
      }
      frame.current = requestAnimationFrame(step)
    },
    [clampSuggestions]
  )

  const onFocus = useCallback(() => {
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
      glideTo(wrap)
    }, KEYBOARD_SLIDE_MS)
  }, [inputRef, wrapRef, glideTo])

  // Leaving the field ends the glide: no late correction jumps on blur.
  const onBlur = useCallback(() => {
    glideStop.current = true
  }, [])

  return { onFocus, onBlur }
}
