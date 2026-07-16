import type { ReactElement } from "react"
import { FieldScene } from "./FieldScene"
import "./Header.css"
import { LogoSheaf } from "./LogoSheaf"

export function Header(): ReactElement {
  return (
    <header>
      <div className="scene" aria-hidden="true">
        <div className="scene-frame">
          <FieldScene />
        </div>
        <span className="logo-sticker">
          <LogoSheaf />
        </span>
      </div>
      <h1>
        Zit er <span className="accent">tarwe</span> in?
      </h1>
      <p className="tagline">Typ een product en je weet het meteen.</p>
    </header>
  )
}
