import type { ReactElement } from "react"
import "./SearchBox.css"
import { Suggestions } from "./Suggestions"
import { useRotatingPlaceholder } from "./useRotatingPlaceholder"
import { useSearchCombobox } from "./useSearchCombobox"

const PLACEHOLDER_TERMS = [
  "stroopwafel",
  "drop",
  "sojasaus",
  "witbier",
  "boekweit",
  "bitterbal",
  "havermout",
]

export function SearchBox(): ReactElement {
  const { inputRef, query, suggestions, activeIndex, choose, check, inputProps } =
    useSearchCombobox("suggestions")
  const placeholder = useRotatingPlaceholder(PLACEHOLDER_TERMS, inputRef)

  return (
    <div className="search-wrap">
      <div className="search-box">
        <input
          ref={inputRef}
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
      <Suggestions
        id="suggestions"
        suggestions={suggestions}
        query={query}
        activeIndex={activeIndex}
        onChoose={choose}
      />
    </div>
  )
}
