import type { ReactElement } from "react"
import { useMemo } from "react"
import { countVerdicts } from "../lib/countVerdicts"
import { useCatalogStore } from "../stores/useCatalogStore"

function format(n: number): string {
  return n.toLocaleString("nl-NL")
}

/** Headline stats: how much the catalog covers; grows once the supermarket list is in. */
export function HeaderStats(): ReactElement {
  const products = useCatalogStore(state => state.products)
  const { total, yes, no } = useMemo(() => countVerdicts(products), [products])
  return (
    <ul className="stats">
      <li className="s-all">
        <b>{format(total)}</b> beoordeeld
      </li>
      <li className="s-yes">
        <b>{format(yes)}</b> tarwe
      </li>
      <li className="s-no">
        <b>{format(no)}</b> vrij
      </li>
    </ul>
  )
}
