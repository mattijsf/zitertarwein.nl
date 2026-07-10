import type { ReactElement } from "react"
import type { Suggestion } from "../../lib/suggest"
import type { Verdict } from "../../types/product"
import { HighlightedName } from "./HighlightedName"
import "./Suggestions.css"

const HINT: Record<Verdict, string> = {
  yes: "🌾 tarwe",
  no: "✅ tarwevrij",
  check: "🤔 check etiket",
}

interface SuggestionsProps {
  id: string
  suggestions: Suggestion[]
  query: string
  activeIndex: number
  onChoose: (suggestion: Suggestion) => void
}

export function Suggestions({
  id,
  suggestions,
  query,
  activeIndex,
  onChoose,
}: SuggestionsProps): ReactElement {
  return (
    <ul
      id={id}
      className={suggestions.length > 0 ? "suggestions open" : "suggestions"}
      role="listbox"
      aria-label="Suggesties"
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={`${suggestion.product.n}|${suggestion.name}`}
          id={`suggestion-${index}`}
          role="option"
          aria-selected={index === activeIndex}
          className={index === activeIndex ? "active" : undefined}
          onMouseDown={e => {
            e.preventDefault() // keep focus in the field, so blur does not close the list first
            onChoose(suggestion)
          }}
        >
          <HighlightedName name={suggestion.name} query={query} />
          <span className="suggestion-hint">{HINT[suggestion.product.s]}</span>
        </li>
      ))}
    </ul>
  )
}
