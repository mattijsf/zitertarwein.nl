import type { ReactElement } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import { useExamplesStore } from "../../stores/useExamplesStore"
import "./Examples.css"
import { RerollButton } from "./RerollButton"

const CHIP_STAGGER_MS = 45

export function Examples(): ReactElement {
  const check = useCheckStore(state => state.check)
  const examples = useExamplesStore(state => state.examples)
  const rollId = useExamplesStore(state => state.rollId)
  const reroll = useExamplesStore(state => state.reroll)
  return (
    <p className="examples">
      Probeer eens:
      <span key={rollId} className="example-chips">
        {examples.map((example, index) => (
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
      <RerollButton onReroll={reroll} />
    </p>
  )
}
