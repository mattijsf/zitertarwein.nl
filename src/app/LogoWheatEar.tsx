import type { ReactElement } from "react"

/** Awns fanning upward from the spikelets. */
const AWNS: readonly string[] = [
  "M54.0 49.8 L47.0 34.8",
  "M66.0 47.2 L73.0 32.2",
  "M53.8 44.5 L46.5 29.0",
  "M66.2 41.9 L73.5 26.4",
  "M53.7 39.1 L46.0 23.1",
  "M66.3 36.5 L74.0 20.5",
  "M53.5 33.8 L45.5 17.3",
  "M66.5 31.2 L74.5 14.7",
  "M53.3 28.5 L45.0 11.5",
  "M66.7 25.9 L75.0 8.9",
  "M53.2 23.1 L44.5 5.6",
  "M66.8 20.5 L75.5 3.0",
  "M53.0 17.8 L44.0 -0.2",
  "M67.0 15.2 L76.0 -2.8",
  "M60 12 L60 -2",
]

/** Spikelets in tapering rows, alternating left and right: cx, cy, rx, ry. */
const SPIKELETS: readonly (readonly [string, string, string, string])[] = [
  ["55", "56.0", "3.4", "6.2"],
  ["65", "53.4", "3.4", "6.2"],
  ["55", "50.4", "3.2", "5.9"],
  ["65", "47.8", "3.2", "5.9"],
  ["55", "44.8", "3.1", "5.7"],
  ["65", "42.2", "3.1", "5.7"],
  ["55", "39.2", "2.9", "5.4"],
  ["65", "36.6", "2.9", "5.4"],
  ["55", "33.6", "2.7", "5.1"],
  ["65", "31.0", "2.7", "5.1"],
  ["55", "28.0", "2.6", "4.9"],
  ["65", "25.4", "2.6", "4.9"],
  ["55", "22.4", "2.4", "4.6"],
  ["65", "19.8", "2.4", "4.6"],
]

/** The logo badge: a single wheat ear on a paper disc; `.logo` sways. */
export function LogoWheatEar(): ReactElement {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="#fffdf6" stroke="rgba(80,52,23,0.3)" strokeWidth="3" />
      <g className="logo">
        <path
          d="M60 104 Q59 80 60 52"
          fill="none"
          stroke="#b97f14"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M59.6 88 C48 84 40.5 74 38.5 62 C47 68 56 75 59.8 84 Z"
          fill="#6da544"
          stroke="#4c7a2e"
          strokeWidth="1.3"
        />
        <path
          d="M60.4 76 C70 72 76.5 64 77.5 53 C70 59 62 66 60.2 72 Z"
          fill="#8fc267"
          stroke="#4c7a2e"
          strokeWidth="1.3"
        />
        <g stroke="#c99422" strokeWidth="1.1" strokeLinecap="round" fill="none">
          {AWNS.map(d => (
            <path key={d} d={d} />
          ))}
        </g>
        <g fill="#ecc04a" stroke="#a97614" strokeWidth="1.1">
          {SPIKELETS.map(([cx, cy, rx, ry], i) => (
            <ellipse
              key={cy}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              transform={`rotate(${i % 2 === 0 ? -24 : 24} ${cx} ${cy})`}
            />
          ))}
          <ellipse cx="60" cy="14" rx="2.4" ry="5.4" />
        </g>
      </g>
    </svg>
  )
}
