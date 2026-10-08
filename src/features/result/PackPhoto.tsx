import type { ReactElement } from "react"

/** The pack front from Open Food Facts on top of the card; the verdict stamp sits on it. */
export function PackPhoto({ url, onError }: { url: string; onError: () => void }): ReactElement {
  return (
    <div className="result-photo">
      <img src={url} alt="" loading="lazy" onError={onError} />
      <small>foto: Open Food Facts</small>
    </div>
  )
}
