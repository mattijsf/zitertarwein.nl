import type { ReactElement } from "react"
import type { ResultIconName } from "./resultIconName"

const LENS = <path d="M30.5 29.5 L38 37" stroke="#503417" strokeWidth="4" strokeLinecap="round" />

/** Hand-drawn icon at the top of a result card. */
export function ResultIcon({ name }: { name: ResultIconName }): ReactElement {
  switch (name) {
    case "yes":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#f6cdbd" />
          <g transform="translate(2 3)">
            <path
              d="M22 40 Q21 24 22 12"
              fill="none"
              stroke="#b97f14"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path d="M22 28 Q14 23 12 15 Q21 18 22 25 Z" fill="#6da544" />
            <g fill="#eaba3b" stroke="#a96f0f" strokeWidth="1">
              <ellipse cx="17" cy="12" rx="3.4" ry="5.4" transform="rotate(24 17 12)" />
              <ellipse cx="27" cy="9" rx="3.4" ry="5.4" transform="rotate(-24 27 9)" />
              <ellipse cx="17" cy="4" rx="3.2" ry="5" transform="rotate(24 17 4)" />
              <ellipse cx="27" cy="1" rx="3.2" ry="5" transform="rotate(-24 27 1)" />
            </g>
          </g>
        </svg>
      )
    case "no":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#d6ecc2" />
          <path
            d="M24 40 Q23 28 24 20"
            fill="none"
            stroke="#4c7a2e"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M24 26 Q12 24 8 12 Q22 13 24 24 Z"
            fill="#6da544"
            stroke="#4c7a2e"
            strokeWidth="1.4"
          />
          <path
            d="M24 22 Q36 20 40 9 Q26 10 24 20 Z"
            fill="#8fc267"
            stroke="#4c7a2e"
            strokeWidth="1.4"
          />
        </svg>
      )
    case "check":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#f7e6b5" />
          <ellipse
            cx="21"
            cy="20"
            rx="5"
            ry="8"
            fill="#eaba3b"
            stroke="#a96f0f"
            strokeWidth="1.4"
            transform="rotate(18 21 20)"
          />
          <circle cx="22" cy="21" r="11.5" fill="none" stroke="#503417" strokeWidth="3.2" />
          {LENS}
        </svg>
      )
    case "search":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#d3ecf5" />
          <circle cx="22" cy="21" r="11.5" fill="#fffdf6" stroke="#503417" strokeWidth="3.2" />
          {LENS}
          <path
            d="M17 21 Q22 15 27 21"
            fill="none"
            stroke="#8a6c49"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    case "unknown":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#e9e2d2" />
          <circle cx="22" cy="21" r="11.5" fill="#fffdf6" stroke="#503417" strokeWidth="3.2" />
          <text x="22" y="27" textAnchor="middle" fontSize="15" fontWeight="800" fill="#8a6c49">
            ?
          </text>
          {LENS}
        </svg>
      )
    case "outage":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#e9e2d2" />
          <g fill="#fffdf6" stroke="#8a6c49" strokeWidth="2">
            <ellipse cx="24" cy="26" rx="13" ry="8" />
            <ellipse cx="16" cy="22" rx="7" ry="6" />
            <ellipse cx="30" cy="21" rx="8" ry="6.5" />
          </g>
          <path d="M12 38 L36 12" stroke="#ad3f24" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      )
    case "install":
      return (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" fill="#d3ecf5" />
          <rect
            x="15"
            y="9"
            width="18"
            height="30"
            rx="4"
            fill="#fffdf6"
            stroke="#503417"
            strokeWidth="2.6"
          />
          <g stroke="#c99422" strokeWidth="0.8" strokeLinecap="round" fill="none">
            <path d="M22.5 15.5 L20.5 11.5" />
            <path d="M25.5 14.5 L27.5 10.5" />
            <path d="M24 13 L24 9.5" />
          </g>
          <path
            d="M24 32.5 Q23.7 24 24 15"
            fill="none"
            stroke="#b97f14"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <g fill="#eaba3b" stroke="#a96f0f" strokeWidth="0.8">
            <ellipse cx="22.4" cy="26.5" rx="1.8" ry="3" transform="rotate(-20 22.4 26.5)" />
            <ellipse cx="25.6" cy="25.2" rx="1.8" ry="3" transform="rotate(20 25.6 25.2)" />
            <ellipse cx="22.4" cy="22.2" rx="1.7" ry="2.8" transform="rotate(-20 22.4 22.2)" />
            <ellipse cx="25.6" cy="20.9" rx="1.7" ry="2.8" transform="rotate(20 25.6 20.9)" />
            <ellipse cx="22.5" cy="18.2" rx="1.6" ry="2.6" transform="rotate(-20 22.5 18.2)" />
            <ellipse cx="25.5" cy="17" rx="1.6" ry="2.6" transform="rotate(20 25.5 17)" />
            <ellipse cx="24" cy="14.4" rx="1.5" ry="2.6" />
          </g>
          <circle cx="24" cy="35.5" r="1.6" fill="#503417" />
        </svg>
      )
  }
}
