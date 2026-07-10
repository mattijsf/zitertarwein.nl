import type { ReactElement } from "react"
import { footerSources } from "../app/footerSources"
import { PopExamples } from "./PopExamples"
import { PopResultCard } from "./PopResultCard"
import { PopSearchBox } from "./PopSearchBox"

const MARQUEE_TEXT =
  "🌾 zit er tarwe in? · check het in één klik · 🌾 zit er tarwe in? · met bronnen die kloppen · 🌾 zit er tarwe in? · check het in één klik · 🌾 zit er tarwe in? · met bronnen die kloppen · "

export function PopApp(): ReactElement {
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {/* two copies, so the -50% scroll loops seamlessly */}
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      <a className="look-switch" href="index.html">
        🌾 klassieke look
      </a>

      <main>
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
        <PopSearchBox />
        <PopResultCard />
        <PopExamples />
      </main>

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
          fabrikanten veranderen. Let op: <em>tarwevrij</em> is niet hetzelfde als{" "}
          <em>glutenvrij</em> (rogge en gerst bevatten óók gluten).
        </p>
      </footer>
    </>
  )
}
