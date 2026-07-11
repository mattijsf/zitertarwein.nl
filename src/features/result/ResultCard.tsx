import type { ReactElement } from "react"
import { useEffect, useRef } from "react"
import { SOURCES } from "../../data/sources"
import { googleUrl } from "../../lib/googleUrl"
import type { InstallPlatform } from "../../lib/installPlatform"
import type { CheckResult } from "../../stores/useCheckStore"
import { useCheckStore } from "../../stores/useCheckStore"
import type { Product, Verdict } from "../../types/product"
import { Confetti } from "./Confetti"
import "./ResultCard.css"

const STYLE: Record<Verdict, { emoji: string; verdict: string }> = {
  yes: { emoji: "🌾", verdict: "Ja, tarwe!" },
  no: { emoji: "🎉", verdict: "Nee, geen tarwe!" },
  check: { emoji: "🧐", verdict: "Check het etiket…" },
}

export function ResultCard(): ReactElement {
  const result = useCheckStore(state => state.result)
  const resultId = useCheckStore(state => state.resultId)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // install help is opened from the top or bottom of the page: bring the card into view
    if (result?.kind === "installHelp") {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [result])
  return (
    <div ref={ref} className={resultClass(result)} role="status" aria-live="polite">
      {result && <ResultBody key={resultId} result={result} />}
    </div>
  )
}

function resultClass(result: CheckResult | null): string {
  if (!result) {
    return "result"
  }
  switch (result.kind) {
    case "product":
      return `result visible ${result.product.s}`
    case "online":
      return `result visible ${result.match.hasWheat ? "yes" : "check"}`
    case "searching":
    case "notFound":
    case "installHelp":
      return "result visible"
  }
}

function ResultBody({ result }: { result: CheckResult }): ReactElement {
  switch (result.kind) {
    case "product":
      return <ProductBody product={result.product} />
    case "searching":
      return (
        <>
          <div className="result-emoji">🔎</div>
          <div className="result-verdict">Even opzoeken…</div>
          <div className="result-product">{result.term}</div>
          <p className="result-info">
            Niet in onze eigen lijst — we bladeren door de etiketten van Open Food Facts.
          </p>
        </>
      )
    case "online": {
      const { match, term } = result
      return (
        <>
          <div className="result-emoji">{match.hasWheat ? "🌾" : "🤔"}</div>
          <div className="result-verdict">
            {match.hasWheat ? "Waarschijnlijk wel tarwe" : "Waarschijnlijk geen tarwe"}
          </div>
          <div className="result-product">{match.name}</div>
          <p className="result-info">
            {match.hasWheat
              ? "In de ingrediëntenlijst van dit product op Open Food Facts staat tarwe."
              : "In de ingrediëntenlijst van dit product op Open Food Facts staat geen tarwe."}{" "}
            Dit is automatisch gelezen uit etiketdata — check voor de zekerheid zelf het etiket.
          </p>
          <p className="result-source">
            Bron:{" "}
            <a href={match.url} target="_blank" rel="noopener noreferrer">
              Open Food Facts
            </a>{" "}
            &nbsp;·&nbsp;{" "}
            <a href={googleUrl(term)} target="_blank" rel="noopener noreferrer">
              zoek op Google
            </a>
          </p>
        </>
      )
    }
    case "notFound":
      return (
        <>
          <div className="result-emoji">🕵️</div>
          <div className="result-verdict">Die kennen we niet…</div>
          <div className="result-product">{result.term}</div>
          <p className="result-info">
            Ook niet gevonden op Open Food Facts. Tip: check de ingrediëntenlijst op het etiket —
            tarwe moet daar verplicht (vetgedrukt) vermeld staan.
          </p>
          <p className="result-info">
            <a
              className="google-button"
              href={googleUrl(result.term)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Zoek op Google&nbsp;→
            </a>
          </p>
        </>
      )
    case "installHelp":
      return <InstallHelpBody platform={result.platform} />
  }
}

function InstallHelpBody({ platform }: { platform: InstallPlatform }): ReactElement {
  return (
    <>
      <div className="result-emoji">📲</div>
      <div className="result-verdict">Zo installeer je de app</div>
      <p className="result-info">
        <InstallSteps platform={platform} />
      </p>
      <p className="result-info">Daarna staat 🌾 als app op je scherm — werkt ook offline.</p>
    </>
  )
}

function InstallSteps({ platform }: { platform: InstallPlatform }): ReactElement {
  switch (platform) {
    case "ios":
      return (
        <>
          Open deze site in Safari, tik op de deelknop (vierkantje met pijl omhoog) en kies{" "}
          <strong>‘Zet op beginscherm’</strong>.
        </>
      )
    case "firefox":
      return (
        <>
          Tik op het menu (⋮) van Firefox en kies <strong>‘Toevoegen aan startscherm’</strong>.
        </>
      )
    case "other":
      return (
        <>
          Open het browsermenu en kies <strong>‘App installeren’</strong> of{" "}
          <strong>‘Toevoegen aan startscherm’</strong>.
        </>
      )
  }
}

function ProductBody({ product }: { product: Product }): ReactElement {
  const style = STYLE[product.s]
  const source = SOURCES[product.b]
  return (
    <>
      <div className="result-emoji">{style.emoji}</div>
      <div className="result-verdict">{style.verdict}</div>
      <div className="result-product">{product.n}</div>
      <p className="result-info">{product.i}</p>
      <p className="result-source">
        Bron:{" "}
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {source.name}
        </a>
      </p>
      {product.s === "no" && <Confetti />}
    </>
  )
}
