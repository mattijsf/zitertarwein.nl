import type { ReactElement } from "react"
import { InstallButton } from "../features/install/InstallButton"
import "./Footer.css"
import { footerSources } from "./footerSources"

export function Footer(): ReactElement {
  return (
    <footer>
      <details className="sources-card">
        <summary>Bronnen &amp; verantwoording</summary>
        <ul>
          {footerSources.map(source => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="sources-note">
          Basisproducten zijn beoordeeld met informatie van het Voedingscentrum en de Nederlandse
          Coeliakie Vereniging. Supermarktproducten komen uit de open etiketdatabase van Open Food
          Facts — elk antwoord linkt naar de bijbehorende productpagina met de volledige
          ingrediëntenlijst.
        </p>
      </details>
      <InstallButton />
      <p className="disclaimer">
        Deze site geeft algemene informatie en is geen medisch advies. Heb je coeliakie, een
        tarweallergie of glutensensitiviteit? Controleer dan altijd het etiket — recepten van
        fabrikanten veranderen. Let op: <em>tarwevrij</em> is niet hetzelfde als <em>glutenvrij</em>{" "}
        (rogge en gerst bevatten óók gluten).
      </p>
    </footer>
  )
}
