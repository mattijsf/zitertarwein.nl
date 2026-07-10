import type { KeyboardEvent, ReactElement } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import "./SearchBox.css"
import { searchInputRef } from "./searchInputRef"
import { Suggestions } from "./Suggestions"
import { useSuggestions } from "./useSuggestions"

const BLUR_CLOSE_DELAY_MS = 120

export function SearchBox(): ReactElement {
  const query = useCheckStore(state => state.query)
  const activeIndex = useCheckStore(state => state.activeIndex)
  const { type, openSuggestions, closeSuggestions, setActiveIndex, check, choose } =
    useCheckStore.getState()
  const suggestions = useSuggestions()
  const open = suggestions.length > 0

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (!open) {
          openSuggestions()
          return
        }
        setActiveIndex((activeIndex + 1) % suggestions.length)
        break
      case "ArrowUp":
        e.preventDefault()
        if (open) {
          setActiveIndex((activeIndex - 1 + suggestions.length) % suggestions.length)
        }
        break
      case "Enter": {
        e.preventDefault()
        const active = suggestions[activeIndex]
        if (active) {
          choose(active)
        } else {
          check()
        }
        break
      }
      case "Escape":
        closeSuggestions()
        break
    }
  }

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
          role="combobox"
          aria-expanded={open}
          aria-controls="suggestions"
          aria-activedescendant={open && activeIndex >= 0 ? `suggestion-${activeIndex}` : ""}
          aria-label="Zoek een product"
          value={query}
          onChange={e => {
            type(e.target.value)
          }}
          onFocus={() => {
            if (query) {
              openSuggestions()
            }
          }}
          onBlur={() => {
            setTimeout(closeSuggestions, BLUR_CLOSE_DELAY_MS)
          }}
          onKeyDown={onKeyDown}
        />
        <button
          className="check-button"
          type="button"
          onClick={() => {
            check()
          }}
        >
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
