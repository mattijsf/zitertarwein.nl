import type { ReactElement, Ref } from "react"
import { capitalize } from "../../lib/capitalize"
import type { Product } from "../../types/product"
import { browseLabels } from "./browseLabels"

interface Props {
  items: readonly Product[]
  /** How many rows are rendered so far. */
  rendered: number
  hidden: boolean
  onPick: (product: Product) => void
  ref?: Ref<HTMLUListElement>
}

export function BrowseList({ items, rendered, hidden, onPick, ref }: Props): ReactElement {
  return (
    <ul ref={ref} className="browse-list" hidden={hidden}>
      {items.slice(0, rendered).map((product, index) => (
        // rows only ever get appended, so the index is a stable key
        <li key={index}>
          <button
            type="button"
            title={capitalize(product.n)}
            onClick={() => {
              onPick(product)
            }}
          >
            <span className="b-name">{capitalize(product.n)}</span>
            <span className={`b-tag ${product.s}`}>{browseLabels.tags[product.s]}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
