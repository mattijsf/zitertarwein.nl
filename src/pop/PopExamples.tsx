import type { ReactElement } from "react"
import { exampleTerms } from "../features/examples/exampleTerms"
import { searchInputRef } from "../features/search/searchInputRef"
import { useCheckStore } from "../stores/useCheckStore"

export function PopExamples(): ReactElement {
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
