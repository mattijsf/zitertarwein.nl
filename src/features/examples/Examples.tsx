import type { ReactElement } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import { useExamplesStore } from "../../stores/useExamplesStore"
import "./Examples.css"

export function Examples(): ReactElement {
  const check = useCheckStore(state => state.check)
  const examples = useExamplesStore(state => state.examples)
  return (
    <p className="examples">
      Probeer eens:
      <span>
        {examples.map(example => (
          <button
            key={example.n}
            type="button"
            onClick={() => {
              check(example.n)
            }}
          >
            {example.n}
          </button>
        ))}
      </span>
    </p>
  )
}
