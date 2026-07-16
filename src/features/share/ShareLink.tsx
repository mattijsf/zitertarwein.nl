import type { ReactElement } from "react"
import "./ShareLink.css"
import type { ShareTarget } from "./useShare"
import { useShare } from "./useShare"

/** "Delen" in the source line, for people who don't recognize the share icon. */
export function ShareLink(target: ShareTarget): ReactElement {
  const { copied, share } = useShare(target)
  return (
    <button type="button" className="share-link" onClick={share}>
      {copied ? "Gekopieerd!" : "Delen"}
    </button>
  )
}
