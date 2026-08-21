import type { ReactElement } from "react"

/** The round logo mark: a line-art wheat ear in currentColor; `.logo` sways. */
export function LogoWheatEar(): ReactElement {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="logo" d="M24 44V15" />
      <g className="logo">
        <path d="M24 36c-6.5 0-10-3.5-10-10 6.5 0 10 3.5 10 10Z" />
        <path d="M24 36c6.5 0 10-3.5 10-10-6.5 0-10 3.5-10 10Z" />
        <path d="M24 27c-6.5 0-10-3.5-10-10 6.5 0 10 3.5 10 10Z" />
        <path d="M24 27c6.5 0 10-3.5 10-10-6.5 0-10 3.5-10 10Z" />
        <path d="M24 18c-3.2-4-3.2-8.5 0-13 3.2 4.5 3.2 9 0 13Z" />
      </g>
    </svg>
  )
}
