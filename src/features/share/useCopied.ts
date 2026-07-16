import { useEffect, useState } from "react"

const COPIED_MS = 1600

/** A "copied" flag that switches itself off after a moment. */
export function useCopied(): [boolean, (copied: boolean) => void] {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) {
      return
    }
    const id = setTimeout(() => {
      setCopied(false)
    }, COPIED_MS)
    return () => {
      clearTimeout(id)
    }
  }, [copied])
  return [copied, setCopied]
}
