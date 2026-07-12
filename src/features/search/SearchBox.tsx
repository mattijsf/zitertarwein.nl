import type { ReactElement } from "react"
import { useMemo } from "react"
import { useExamplesStore } from "../../stores/useExamplesStore"
import { ScanButton } from "../scanner/ScanButton"
import "./SearchBox.css"
import { Suggestions } from "./Suggestions"
import { useRotatingPlaceholder } from "./useRotatingPlaceholder"
import { useSearchCombobox } from "./useSearchCombobox"

export function SearchBox(): ReactElement {
  const { inputRef, query, suggestions, activeIndex, choose, check, inputProps } =
    useSearchCombobox("suggestions")
  const examples = useExamplesStore(state => state.examples)
  const placeholderTerms = useMemo(() => examples.map(p => p.n), [examples])
  const placeholder = useRotatingPlaceholder(placeholderTerms, inputRef)

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
        <ScanButton />
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
