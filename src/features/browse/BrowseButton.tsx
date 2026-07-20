import type { ReactElement } from "react"
import "./BrowseButton.css"
import { browseHistory } from "./browseHistory"

export function BrowseButton(): ReactElement {
  return (
    <p className="browse-open-wrap">
      <button
        className="browse-open"
        type="button"
        onClick={() => {
          browseHistory.open()
        }}
      >
        Blader door alle producten
      </button>
    </p>
  )
}
