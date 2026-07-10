import type { ReactElement } from "react"
import { HighlightedName } from "../features/search/HighlightedName"
import { searchInputRef } from "../features/search/searchInputRef"
import { useSearchCombobox } from "../features/search/useSearchCombobox"
import type { Verdict } from "../types/product"
import { useRotatingPlaceholder } from "./useRotatingPlaceholder"

const PLACEHOLDER_TERMS = [
  "stroopwafel",
  "drop",
  "sojasaus",
  "witbier",
  "boekweit",
  "bitterbal",
  "havermout",
]

const HINT: Record<Verdict, string> = {
  yes: "tarwe",
  no: "vrij",
  check: "etiket",
}

export function PopSearchBox(): ReactElement {
  const { query, suggestions, activeIndex, choose, check, inputProps } =
    useSearchCombobox("suggestions")
  const placeholder = useRotatingPlaceholder(PLACEHOLDER_TERMS, searchInputRef)

  return (
    <div className="search-wrap">
      <div className="search-box">
        <input
          ref={searchInputRef}
          className="product-input"
          type="text"
          placeholder={`Bijv. ${placeholder}…`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Zoek een product"
          {...inputProps}
        />
        <button className="check-button" type="button" onClick={check}>
          Check!
        </button>
      </div>
      <ul
        id="suggestions"
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
              choose(suggestion)
            }}
          >
            <HighlightedName name={suggestion.name} query={query} />
            <span className={`suggestion-hint ${suggestion.product.s}`}>
              {HINT[suggestion.product.s]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
