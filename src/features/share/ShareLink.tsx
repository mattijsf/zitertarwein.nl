import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import "./ShareLink.css"
import { shareProduct } from "./shareProduct"

const COPIED_MS = 1600

/** "Delen" in the source line of an answer. */
export function ShareLink({ name, verdict }: { name: string; verdict: string }): ReactElement {
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
  return (
    <button
      type="button"
      className="share-link"
      onClick={() => {
        shareProduct(name, verdict).then(
          outcome => {
            setCopied(outcome === "copied")
          },
          () => {
            // clipboard refused: nothing to show
          }
        )
      }}
    >
      {copied ? "Gekopieerd!" : "Delen"}
    </button>
  )
}
