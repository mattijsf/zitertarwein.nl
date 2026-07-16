import type { ReactElement } from "react"
import { useMemo, useState } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import { useExamplesStore } from "../../stores/useExamplesStore"
import { ScanButton } from "../scanner/ScanButton"
import "./SearchBox.css"
import { Suggestions } from "./Suggestions"
import { useRotatingPlaceholder } from "./useRotatingPlaceholder"
import { useSearchCombobox } from "./useSearchCombobox"

const CLEAR_BLUR_DELAY_MS = 150

export function SearchBox(): ReactElement {
  const { inputRef, query, suggestions, activeIndex, choose, check, inputProps } =
    useSearchCombobox("suggestions")
  const examples = useExamplesStore(state => state.examples)
  const placeholderTerms = useMemo(() => examples.map(p => p.n), [examples])
  const placeholder = useRotatingPlaceholder(placeholderTerms, inputRef)
  const [focused, setFocused] = useState(false)

  return (
    <div className="search-wrap">
      <div className="search-box">
        <div className="input-wrap">
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
            onFocus={() => {
              setFocused(true)
            }}
            onBlur={() => {
              inputProps.onBlur()
              setTimeout(() => {
                setFocused(document.activeElement === inputRef.current)
              }, CLEAR_BLUR_DELAY_MS)
            }}
          />
          <button
            className="input-clear"
            type="button"
            hidden={!(focused && query)}
            aria-label="Wis invoer"
            onMouseDown={e => {
              e.preventDefault() // keep focus in the field
              const { setQuery, closeSuggestions } = useCheckStore.getState()
              setQuery("")
              closeSuggestions()
              inputRef.current?.focus()
            }}
          >
            ✕
          </button>
        </div>
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
