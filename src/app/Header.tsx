import type { ReactElement } from "react"
import "./Header.css"
import { HeaderStats } from "./HeaderStats"
import { LogoWheatEar } from "./LogoWheatEar"

export function Header(): ReactElement {
  return (
    <header>
      <span className="logo-sticker" aria-hidden="true">
        <LogoWheatEar />
      </span>
      <h1>
        Zit er <span className="accent">tarwe</span> in?
      </h1>
      <p className="tagline">Typ een product en je weet het meteen.</p>
      <HeaderStats />
    </header>
  )
}
