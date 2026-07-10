import type { ReactElement } from "react"
import { normalize } from "../../lib/normalize"

/** The name with the typed part wrapped in <mark>. */
export function HighlightedName({ name, query }: { name: string; query: string }): ReactElement {
  const t = normalize(query)
  const pos = normalize(name).indexOf(t)
  if (pos < 0) {
    return <span>{name}</span>
  }
  return (
    <span>
      {name.slice(0, pos)}
      <mark>{name.slice(pos, pos + t.length)}</mark>
      {name.slice(pos + t.length)}
    </span>
  )
}
