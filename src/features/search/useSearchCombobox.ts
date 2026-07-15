import type { KeyboardEvent, RefObject } from "react"
import { useRef } from "react"
import type { Suggestion } from "../../lib/suggest"
import { useCheckStore } from "../../stores/useCheckStore"
import { useSuggestions } from "./useSuggestions"

const BLUR_CLOSE_DELAY_MS = 120

export interface SearchCombobox {
  inputRef: RefObject<HTMLInputElement | null>
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

/** Behaviour of the search field and its suggestion list. */
export function useSearchCombobox(listId: string): SearchCombobox {
  const inputRef = useRef<HTMLInputElement>(null)
  const query = useCheckStore(state => state.query)
  const activeIndex = useCheckStore(state => state.activeIndex)
  const { type, openSuggestions, closeSuggestions, setActiveIndex } = useCheckStore.getState()
  // blur hides the on-screen keyboard on mobile, so the result is visible
  const check = (): void => {
    inputRef.current?.blur()
    useCheckStore.getState().check()
  }
  const choose = (suggestion: Suggestion): void => {
    inputRef.current?.blur()
    useCheckStore.getState().choose(suggestion)
  }
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
        // an open list takes this Escape; the result card ignores it then
        if (open) {
          e.stopPropagation()
        }
        closeSuggestions()
        break
    }
  }

  return {
    inputRef,
    query,
    suggestions,
    activeIndex,
    choose,
    check,
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
