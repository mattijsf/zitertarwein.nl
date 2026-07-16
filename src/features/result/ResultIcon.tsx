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
          <g stroke="#c99422" strokeWidth="1" strokeLinecap="round" fill="none">
            <path d="M21.5 16 L18.5 6.5" />
            <path d="M26.5 14.5 L29.5 5" />
            <path d="M24 12.5 L24 4" />
          </g>
          <path
            d="M24 41 Q23.7 30 24 15"
            fill="none"
            stroke="#b97f14"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M24 37 Q18.8 34.5 17 29 Q22.4 31.5 24 35 Z"
            fill="#6da544"
            stroke="#4c7a2e"
            strokeWidth="1"
          />
          <g fill="#eaba3b" stroke="#a96f0f" strokeWidth="1">
            <ellipse cx="21.9" cy="28.2" rx="2.2" ry="3.5" transform="rotate(-20 21.9 28.2)" />
            <ellipse cx="26.1" cy="26.6" rx="2.2" ry="3.5" transform="rotate(20 26.1 26.6)" />
            <ellipse cx="21.9" cy="24.2" rx="2.1" ry="3.3" transform="rotate(-20 21.9 24.2)" />
            <ellipse cx="26.1" cy="22.6" rx="2.1" ry="3.3" transform="rotate(20 26.1 22.6)" />
            <ellipse cx="22" cy="20.4" rx="2" ry="3.1" transform="rotate(-20 22 20.4)" />
            <ellipse cx="26" cy="18.8" rx="2" ry="3.1" transform="rotate(20 26 18.8)" />
            <ellipse cx="24" cy="15.2" rx="1.9" ry="3.2" />
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
          <g transform="rotate(-8 20 24)">
            <rect
              x="11.5"
              y="14"
              width="17"
              height="20"
              rx="2.5"
              fill="#fffdf6"
              stroke="#8a6c49"
              strokeWidth="1.6"
            />
            <g stroke="#c9b8a0" strokeWidth="1.4" strokeLinecap="round">
              <path d="M15 19.5 h10" />
              <path d="M15 23.5 h10" />
              <path d="M15 27.5 h6.5" />
            </g>
          </g>
          <circle
            cx="28.5"
            cy="26.5"
            r="7.5"
            fill="rgba(211,236,245,0.55)"
            stroke="#503417"
            strokeWidth="2.8"
          />
          <path d="M34 32 L39.5 37.5" stroke="#503417" strokeWidth="3.6" strokeLinecap="round" />
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
