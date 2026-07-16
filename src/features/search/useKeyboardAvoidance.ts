import type { RefObject } from "react"
import { useCallback, useEffect, useRef } from "react"

const SMALL_SCREEN_MAX_WIDTH = 700
const KEYBOARD_SLIDE_MS = 300
const PARK_MARGIN = 10
const GLIDE_MS = 380
const SAFETY_NET_EXTRA_MS = 150

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
  const safetyNet = useRef(0)
  const frame = useRef(0)
  const glideStop = useRef(false)

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

  // Smooth frame-by-frame scroll. The browser's native smooth scrolling gets
  // cancelled by its own focus handling, so we drive it ourselves.
  const glideTo = useCallback(
    (targetY: number, duration = GLIDE_MS): void => {
      const startY = window.scrollY
      const delta = targetY - startY
      if (Math.abs(delta) < 2) {
        clampSuggestions()
        return
      }
      glideStop.current = false
      const start = performance.now()
      // Safety net: if animation frames never run (throttled background
      // view), jump to the target so the layout still ends up right.
      safetyNet.current = window.setTimeout(() => {
        if (!glideStop.current && Math.abs(window.scrollY - targetY) > 4) {
          window.scrollTo(0, targetY)
          clampSuggestions()
        }
      }, duration + SAFETY_NET_EXTRA_MS)
      const net = safetyNet.current
      const step = (now: number): void => {
        if (glideStop.current) {
          clearTimeout(net)
          return
        }
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
        window.scrollTo(0, startY + delta * eased)
        if (t < 1) {
          frame.current = requestAnimationFrame(step)
        } else {
          clearTimeout(net)
          clampSuggestions()
        }
      }
      frame.current = requestAnimationFrame(step)
    },
    [clampSuggestions]
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
      glideTo(window.scrollY + wrap.getBoundingClientRect().top - PARK_MARGIN)
    }, KEYBOARD_SLIDE_MS)
  }, [inputRef, wrapRef, glideTo])
}
