import type { ReactElement } from "react"
import "./Header.css"
import { HeaderStats } from "./HeaderStats"

export function Header(): ReactElement {
  return (
    <header>
      <img
        className="plaat"
        src="/plaat-tarwe.webp"
        alt=""
        width="560"
        height="789"
        decoding="async"
      />
      <h1>
        Zit er <em className="accent">tarwe</em> in?
      </h1>
      <p className="tagline">Typ een product en lees wat er op het etiket staat.</p>
      <HeaderStats />
    </header>
  )
}
