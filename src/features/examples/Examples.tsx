import type { ReactElement } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import "./Examples.css"
import { exampleProducts } from "./exampleProducts"

const CHIP_STAGGER_MS = 45

export function Examples(): ReactElement {
  const check = useCheckStore(state => state.check)
  return (
    <p className="examples">
      Probeer eens
      <span className="example-chips">
        {exampleProducts.map((example, index) => (
          <button
            key={example.n}
            type="button"
            style={{ animationDelay: `${index * CHIP_STAGGER_MS}ms` }}
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
