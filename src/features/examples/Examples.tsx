import type { ReactElement } from "react"
import { Fragment } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import "./Examples.css"
import { exampleProducts } from "./exampleProducts"

/** "Of probeer a, b of c." — a sentence with links, not chips. */
export function Examples(): ReactElement {
  const check = useCheckStore(state => state.check)
  return (
    <p className="examples">
      Of probeer{" "}
      <span className="example-links">
        {exampleProducts.map((example, index) => (
          <Fragment key={example.n}>
            {index > 0 && (index === exampleProducts.length - 1 ? " of " : ", ")}
            <button
              type="button"
              onClick={() => {
                check(example.n)
              }}
            >
              {example.n}
            </button>
          </Fragment>
        ))}
      </span>
      .
    </p>
  )
}
