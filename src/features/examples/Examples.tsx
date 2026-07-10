import type { ReactElement } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import { searchInputRef } from "../search/searchInputRef"
import "./Examples.css"
import { exampleTerms } from "./exampleTerms"

export function Examples(): ReactElement {
  const check = useCheckStore(state => state.check)
  return (
    <p className="examples">
      Probeer eens:
      {exampleTerms.map(example => (
        <button
          key={example}
          type="button"
          onClick={() => {
            searchInputRef.current?.focus()
            check(example)
          }}
        >
          {example}
        </button>
      ))}
    </p>
  )
}
