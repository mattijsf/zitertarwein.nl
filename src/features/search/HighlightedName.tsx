import type { ReactElement } from "react"
import { normalize } from "../../lib/normalize"
import { normalizeWithMap } from "../../lib/normalizeWithMap"

/** The name with the typed part wrapped in <mark>. */
export function HighlightedName({ name, query }: { name: string; query: string }): ReactElement {
  const t = normalize(query)
  const { out, map } = normalizeWithMap(name)
  const pos = out.indexOf(t)
  // map positions back to the original string, which may hold stripped characters
  const start = t ? map[pos] : undefined
  const last = t ? map[pos + t.length - 1] : undefined
  if (pos < 0 || start === undefined || last === undefined) {
    return <span>{name}</span>
  }
  const end = last + 1
  return (
    <span>
      {name.slice(0, start)}
      <mark>{name.slice(start, end)}</mark>
      {name.slice(end)}
    </span>
  )
}
