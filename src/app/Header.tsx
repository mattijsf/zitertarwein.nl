import type { ReactElement } from "react"
import "./Header.css"
import { HeaderStats } from "./HeaderStats"

export function Header(): ReactElement {
  return (
    <header>
      <div className="runhead">
        <span>Zitertarwein.nl</span>
        <span className="reg">NL · EU 1169/2011</span>
      </div>
      <div className="rule" />
      <h1>
        Zit er <span className="accent">tarwe</span> in?
      </h1>
      <p className="tagline">
        Allergenen moeten op ieder etiket benadrukt worden. Deze site leest ze voor je terug.
      </p>
      <HeaderStats />
    </header>
  )
}
