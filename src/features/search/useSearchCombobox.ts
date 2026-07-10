import type { KeyboardEvent } from "react"
import type { Suggestion } from "../../lib/suggest"
import { useCheckStore } from "../../stores/useCheckStore"
import { useSuggestions } from "./useSuggestions"

const BLUR_CLOSE_DELAY_MS = 120

export interface SearchCombobox {
  query: string
  suggestions: Suggestion[]
  activeIndex: number
  choose: (suggestion: Suggestion) => void
  check: () => void
  /** Props for the product field: value, ARIA and the keyboard handling. */
  inputProps: {
    role: "combobox"
    "aria-expanded": boolean
    "aria-controls": string
    "aria-activedescendant": string
    value: string
    onChange: (e: { target: { value: string } }) => void
    onBlur: () => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  }
}

/** Behaviour of the search field and its suggestion list, shared by every look. */
export function useSearchCombobox(listId: string): SearchCombobox {
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

  return {
    query,
    suggestions,
    activeIndex,
    choose,
    check: () => {
      check()
    },
    inputProps: {
      role: "combobox",
      "aria-expanded": open,
      "aria-controls": listId,
      "aria-activedescendant": open && activeIndex >= 0 ? `suggestion-${activeIndex}` : "",
      value: query,
      onChange: e => {
        type(e.target.value)
      },
      onBlur: () => {
        setTimeout(closeSuggestions, BLUR_CLOSE_DELAY_MS)
      },
      onKeyDown,
    },
  }
}
