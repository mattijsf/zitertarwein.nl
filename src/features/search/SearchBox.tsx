import type { ReactElement } from "react"
import { useRef } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import { exampleProducts } from "../examples/exampleProducts"
import { ScanButton } from "../scanner/ScanButton"
import "./SearchBox.css"
import { Suggestions } from "./Suggestions"
import { useKeyboardAvoidance } from "./useKeyboardAvoidance"
import { useRotatingPlaceholder } from "./useRotatingPlaceholder"
import { useSearchCombobox } from "./useSearchCombobox"
import { useSuggestionsClamp } from "./useSuggestionsClamp"

const PLACEHOLDER_TERMS = exampleProducts.map(p => p.n)

export function SearchBox(): ReactElement {
  const { inputRef, query, suggestions, activeIndex, choose, check, inputProps } =
    useSearchCombobox("suggestions")
  const placeholder = useRotatingPlaceholder(PLACEHOLDER_TERMS, inputRef)
  const boxRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  useSuggestionsClamp(listRef, boxRef, suggestions.length > 0, suggestions)
  const onFocusKeepVisible = useKeyboardAvoidance(inputRef, boxRef)

  return (
    <div className="search-wrap">
      <p className="caps field-label">Product</p>
      <div ref={boxRef} className="search-box">
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
            onFocus={onFocusKeepVisible}
          />
          <button
            className="input-clear"
            type="button"
            hidden={!query}
            aria-label="Wis invoer"
            onMouseDown={e => {
              e.preventDefault() // keep focus in the field
              useCheckStore.getState().clear() // input, suggestions, result card and ?p= link
              inputRef.current?.focus()
            }}
          >
            ✕
          </button>
        </div>
        <ScanButton />
        <button className="check-button" type="button" onClick={check}>
          Check
        </button>
      </div>
      <Suggestions
        id="suggestions"
        listRef={listRef}
        suggestions={suggestions}
        query={query}
        activeIndex={activeIndex}
        onChoose={choose}
      />
    </div>
  )
}
