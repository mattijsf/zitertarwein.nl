import type { ReactElement } from "react"
import { useState } from "react"
import { pickRandom } from "../../lib/pickRandom"
import "./Fact.css"
import { FACTS } from "./facts"

export function Fact(): ReactElement {
  const [fact] = useState(() => pickRandom(FACTS, 1)[0] ?? "")
  return <p className="fact">{fact}</p>
}
