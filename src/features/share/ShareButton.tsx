import type { ReactElement } from "react"
import type { ShareTarget } from "./useShare"
import { useShare } from "./useShare"

/** Round share icon in the corner of an answer card. */
export function ShareButton(target: ShareTarget): ReactElement {
  const { copied, share } = useShare(target)
  return (
    <button
      type="button"
      className="share-button"
      aria-label="Deel dit antwoord"
      title="Delen"
      onClick={share}
    >
      {/* currentColor: the icon takes the card's ink, legible on white and coloured cards */}
      {copied ? (
        "✓"
      ) : (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="6" cy="12" r="2.7" fill="currentColor" />
            <circle cx="17.5" cy="5.5" r="2.7" fill="currentColor" />
            <circle cx="17.5" cy="18.5" r="2.7" fill="currentColor" />
            <path d="M8.4 10.6 15 6.9M8.4 13.4l6.6 3.7" fill="none" />
          </g>
        </svg>
      )}
    </button>
  )
}
