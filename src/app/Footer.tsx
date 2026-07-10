import type { ReactElement } from "react"
import "./Footer.css"
import { footerSources } from "./footerSources"

export function Footer(): ReactElement {
  return (
    <footer>
      <div className="sources-card">
        <h2>Bronnen</h2>
        <ul>
          {footerSources.map(source => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="disclaimer">
        Deze site geeft algemene informatie en is geen medisch advies. Heb je coeliakie, een
        tarweallergie of glutensensitiviteit? Controleer dan altijd het etiket — recepten van
        fabrikanten veranderen. Let op: <em>tarwevrij</em> is niet hetzelfde als <em>glutenvrij</em>{" "}
        (rogge en gerst bevatten óók gluten).
      </p>
    </footer>
  )
}
