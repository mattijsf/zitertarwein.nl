import type { RefObject } from "react"
import { useEffect, useState } from "react"

const ROTATE_MS = 2600

/** Cycles through the terms while the field is empty and not focused. */
export function useRotatingPlaceholder(
  terms: readonly string[],
  inputRef: RefObject<HTMLInputElement | null>
): string {
  const [index, setIndex] = useState(0)
  // new terms (rerolled examples) start again at the first one
  const [shownTerms, setShownTerms] = useState(terms)
  if (shownTerms !== terms) {
    setShownTerms(terms)
    setIndex(0)
  }
  useEffect(() => {
    const id = setInterval(() => {
      const input = inputRef.current
      if (input && document.activeElement !== input && !input.value) {
        setIndex(i => (i + 1) % terms.length)
      }
    }, ROTATE_MS)
    return () => {
      clearInterval(id)
    }
  }, [terms, inputRef])
  return terms[index % terms.length] ?? ""
}
