import type { ReactElement } from "react"
import { SOURCES } from "../data/sources"
import type { CheckResult } from "../stores/useCheckStore"
import { useCheckStore } from "../stores/useCheckStore"
import type { Verdict } from "../types/product"
import { Confetti } from "./Confetti"

const STYLE: Record<Verdict, { emoji: string; verdict: string }> = {
  yes: { emoji: "🌾", verdict: "Ja, tarwe!" },
  no: { emoji: "🎉", verdict: "Nee, geen tarwe!" },
  check: { emoji: "🧐", verdict: "Check het etiket…" },
}

export function PopResultCard(): ReactElement {
  const result = useCheckStore(state => state.result)
  const resultId = useCheckStore(state => state.resultId)
  return (
    <div className={resultClass(result)} role="status" aria-live="polite">
      {result && <ResultBody key={resultId} result={result} />}
    </div>
  )
}

function resultClass(result: CheckResult | null): string {
  if (!result) {
    return "result"
  }
  return result.kind === "product" ? `result visible ${result.product.s}` : "result visible"
}

function ResultBody({ result }: { result: CheckResult }): ReactElement {
  if (result.kind === "unknown") {
    return (
      <>
        <div className="result-emoji">🕵️</div>
        <div className="result-verdict">Die kennen we niet…</div>
        <div className="result-product">{result.term}</div>
        <p className="result-info">
          Dit product staat niet in onze lijst. Tip: check de ingrediëntenlijst op het etiket —
          tarwe moet daar verplicht (vetgedrukt) vermeld staan. Of zoek het op in de{" "}
          <a
            href="https://www.voedingscentrum.nl/encyclopedie.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            encyclopedie van het Voedingscentrum
          </a>
          .
        </p>
      </>
    )
  }
  const { product } = result
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
