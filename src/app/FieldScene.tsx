import type { ReactElement } from "react"

/** Wheat stalks along the field: x, y, scale and sway offset. */
const STALKS: readonly (readonly [number, number, number, string])[] = [
  [28, 120, 1.02, "-0.4s"],
  [86, 126, 0.92, "-1.6s"],
  [146, 118, 1.1, "-2.7s"],
  [208, 124, 0.96, "-0.9s"],
  [268, 118, 1.05, "-2.1s"],
  [436, 118, 1.05, "-1.2s"],
  [498, 124, 0.94, "-3.1s"],
  [558, 116, 1.12, "-0.2s"],
  [620, 124, 0.98, "-1.9s"],
  [678, 120, 1.04, "-2.5s"],
]

const FLOWERS: readonly string[] = [
  "translate(330 208)",
  "translate(392 214) scale(0.85)",
  "translate(120 210) scale(0.9)",
  "translate(600 212) scale(0.8)",
]

/** Header artwork: sky, sun, clouds, hills and a row of swaying wheat. */
export function FieldScene(): ReactElement {
  return (
    <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8e7f3" />
          <stop offset="1" stopColor="#f7f0d9" />
        </linearGradient>
        <linearGradient id="hillg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9cd7c" />
          <stop offset="1" stopColor="#7fae4e" />
        </linearGradient>
        <linearGradient id="fieldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c964" />
          <stop offset="1" stopColor="#d6981f" />
        </linearGradient>
        <g id="wheat">
          <path
            d="M12 64 Q11 42 12 22"
            fill="none"
            stroke="#b97f14"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M12 48 Q4 43 2 34 Q10 37 12 44 Z" fill="#6da544" />
          <g fill="#eaba3b" stroke="#b97f14" strokeWidth="1">
            <ellipse cx="7" cy="21" rx="3.4" ry="5.6" transform="rotate(24 7 21)" />
            <ellipse cx="17" cy="18" rx="3.4" ry="5.6" transform="rotate(-24 17 18)" />
            <ellipse cx="7" cy="13" rx="3.2" ry="5.2" transform="rotate(24 7 13)" />
            <ellipse cx="17" cy="10" rx="3.2" ry="5.2" transform="rotate(-24 17 10)" />
            <ellipse cx="11" cy="5" rx="3" ry="5" />
          </g>
          <g stroke="#c99422" strokeWidth="1" strokeLinecap="round">
            <path d="M6 14 L2 4" />
            <path d="M16 11 L20 1" />
            <path d="M11 0 L11 -6" />
          </g>
        </g>
        <g id="flower">
          <g fill="#5b8fd6">
            <circle cx="0" cy="-3.2" r="2.4" />
            <circle cx="3" cy="-1" r="2.4" />
            <circle cx="1.9" cy="2.6" r="2.4" />
            <circle cx="-1.9" cy="2.6" r="2.4" />
            <circle cx="-3" cy="-1" r="2.4" />
          </g>
          <circle cx="0" cy="0" r="1.6" fill="#f2c94c" />
        </g>
      </defs>
      <rect width="720" height="230" fill="url(#skyg)" />
      <g className="sun">
        <g stroke="#e5b338" strokeWidth="3" strokeLinecap="round">
          <path d="M598 12 v14" />
          <path d="M598 96 v14" />
          <path d="M556 54 h-14" />
          <path d="M640 54 h14" />
          <path d="M568 24 l-10 -10" />
          <path d="M628 24 l10 -10" />
          <path d="M568 84 l-10 10" />
          <path d="M628 84 l10 10" />
        </g>
        <circle cx="598" cy="54" r="26" fill="#f8cf5e" stroke="#daa62a" strokeWidth="3" />
      </g>
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="150" cy="52" rx="34" ry="13" />
        <ellipse cx="176" cy="44" rx="24" ry="11" />
        <ellipse cx="124" cy="44" rx="20" ry="10" />
        <ellipse cx="400" cy="34" rx="28" ry="11" />
        <ellipse cx="422" cy="27" rx="18" ry="9" />
      </g>
      <path d="M0 152 Q180 112 360 140 T720 134 V230 H0 Z" fill="url(#hillg)" />
      <path d="M0 192 Q200 160 400 178 T720 170 V230 H0 Z" fill="url(#fieldg)" />
      {STALKS.map(([x, y, scale, delay]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}>
          <use href="#wheat" className="stalk" style={{ animationDelay: delay }} />
        </g>
      ))}
      {FLOWERS.map(transform => (
        <use key={transform} href="#flower" transform={transform} />
      ))}
    </svg>
  )
}
