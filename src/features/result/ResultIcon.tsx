import type { ReactElement, ReactNode } from "react"
import type { ResultIconName } from "./resultIconName"

/** Line-art glyph on a 48 grid; strokes use currentColor, so it takes the card's ink. */
function Glyph({ children }: { children: ReactNode }): ReactElement {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/** Flat line-art icon at the top of a result card. */
export function ResultIcon({ name }: { name: ResultIconName }): ReactElement {
  switch (name) {
    case "yes":
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M24 44V15" />
          <path d="M24 36c-6.5 0-10-3.5-10-10 6.5 0 10 3.5 10 10Z" />
          <path d="M24 36c6.5 0 10-3.5 10-10-6.5 0-10 3.5-10 10Z" />
          <path d="M24 27c-6.5 0-10-3.5-10-10 6.5 0 10 3.5 10 10Z" />
          <path d="M24 27c6.5 0 10-3.5 10-10-6.5 0-10 3.5-10 10Z" />
          <path d="M24 18c-3.2-4-3.2-8.5 0-13 3.2 4.5 3.2 9 0 13Z" />
        </svg>
      )
    case "no":
      return (
        <Glyph>
          <path d="M24 43V21" />
          <path d="M24 30c-8 0-12-5-12-13 8 0 12 5 12 13Z" />
          <path d="M24 24c8 0 12-5 12-13-8 0-12 5-12 13Z" />
        </Glyph>
      )
    case "check":
      return (
        <Glyph>
          <circle cx="21" cy="21" r="12" />
          <path d="M30 30 40 40" />
          <path d="M16 18h10M16 24h6" />
        </Glyph>
      )
    case "search":
      return (
        <Glyph>
          <circle cx="21" cy="21" r="12" />
          <path d="M30 30 40 40" />
        </Glyph>
      )
    case "unknown":
      return (
        <Glyph>
          <circle cx="24" cy="24" r="16" />
          <path d="M19 19a5 5 0 1 1 5 6v2.5" />
          <path d="M24 33.5h.01" />
        </Glyph>
      )
    case "outage":
      return (
        <Glyph>
          <path d="M16 34h16a8 8 0 0 0-1-16 11 11 0 0 0-20 3 6 6 0 0 0 5 13Z" />
          <path d="M13 39 35 11" />
        </Glyph>
      )
    case "install":
      return (
        <Glyph>
          <rect x="14" y="5" width="20" height="38" rx="6" />
          <path d="M24 16v12" />
          <path d="M19 23l5 5 5-5" />
        </Glyph>
      )
  }
}
