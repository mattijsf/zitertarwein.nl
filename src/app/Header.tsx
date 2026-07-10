import type { ReactElement } from "react"
import "./Header.css"

export function Header(): ReactElement {
  return (
    <header>
      <span className="logo-sticker">
        <span className="logo" aria-hidden="true">
          🌾
        </span>
      </span>
      <h1>
        Zit er <span className="accent">tarwe</span> in?
      </h1>
      <p className="tagline">Typ een product en je weet het meteen.</p>
    </header>
  )
}
