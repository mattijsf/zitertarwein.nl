import type { ReactElement } from "react"
import "./Header.css"
import { useHarvest } from "./useHarvest"

export function Header(): ReactElement {
  const { phase, start } = useHarvest()
  return (
    <header>
      <span className="logo-sticker" title="Oogsten!" onClick={start}>
        <span className={phase === "idle" ? "logo" : `logo ${phase}`} aria-hidden="true">
          {phase === "grow" ? "🌱" : "🌾"}
        </span>
      </span>
      <h1>
        Zit er <span className="accent">tarwe</span> in?
      </h1>
      <p className="tagline">Typ een product en je weet het meteen.</p>
    </header>
  )
}
