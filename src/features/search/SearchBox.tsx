import type { ReactElement } from "react"
import "./SearchBox.css"
import { searchInputRef } from "./searchInputRef"
import { Suggestions } from "./Suggestions"
import { useSearchCombobox } from "./useSearchCombobox"

export function SearchBox(): ReactElement {
  const { query, suggestions, activeIndex, choose, check, inputProps } =
    useSearchCombobox("suggestions")

  return (
    <div className="search-wrap">
      <div className="search-box">
        <input
          ref={searchInputRef}
          className="product-input"
          type="text"
          placeholder="Bijv. stroopwafel, drop, sojasaus…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Zoek een product"
          {...inputProps}
        />
        <button className="check-button" type="button" onClick={check}>
          Check! 🔍
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
