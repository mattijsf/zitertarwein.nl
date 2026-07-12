import type { ReactElement } from "react"
import { useState } from "react"
import "./Fact.css"
import { FACT_COLORS, FACTS } from "./facts"

/** A "wist je dat" sticker; a click shows the next fact in another colour. */
export function Fact(): ReactElement {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * FACTS.length))
  const next = (): void => {
    setIndex(i => i + 1)
  }
  return (
    <p
      id="fact"
      className="fact"
      title="Klik voor nog een weetje"
      style={{ background: FACT_COLORS[index % FACT_COLORS.length] }}
      role="button"
      tabIndex={0}
      onClick={next}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          next()
        }
      }}
    >
      {FACTS[index % FACTS.length]}
    </p>
  )
}
