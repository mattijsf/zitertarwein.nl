import type { ReactElement } from "react"
import { SOURCES } from "../data/sources"
import "./Footer.css"

const FOOTER_SOURCES = [
  {
    name: "Voedingscentrum — Gluten en het glutenvrij dieet",
    url: SOURCES["vc-gluten"].url,
  },
  {
    name: "Voedingscentrum — Tarwe: volkorenmeel en bloem",
    url: SOURCES["vc-tarwe"].url,
  },
  {
    name: "Nederlandse Coeliakie Vereniging — glutenvrij.nl",
    url: SOURCES.ncv.url,
  },
]

export function Footer(): ReactElement {
  return (
    <footer>
      <h2>Bronnen</h2>
      <ul>
        {FOOTER_SOURCES.map(source => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="disclaimer">
        Deze site geeft algemene informatie en is geen medisch advies. Heb je coeliakie, een
        tarweallergie of glutensensitiviteit? Controleer dan altijd het etiket — recepten van
        fabrikanten veranderen. Let op: <em>tarwevrij</em> is niet hetzelfde als <em>glutenvrij</em>{" "}
        (rogge en gerst bevatten óók gluten).
      </p>
    </footer>
  )
}
