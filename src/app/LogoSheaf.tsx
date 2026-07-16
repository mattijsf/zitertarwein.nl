import type { ReactElement } from "react"

/** One of the two side ears of the sheaf, tilted around the binding. */
function SideEar({ angle, stem }: { angle: number; stem: string }): ReactElement {
  return (
    <g transform={`rotate(${angle} 60 100)`}>
      <path d={stem} fill="none" stroke="#b97f14" strokeWidth="3" strokeLinecap="round" />
      <g fill="#eaba3b" stroke="#b97f14" strokeWidth="1.2">
        <ellipse cx="54" cy="45" rx="4" ry="6.6" transform="rotate(24 54 45)" />
        <ellipse cx="66" cy="41" rx="4" ry="6.6" transform="rotate(-24 66 41)" />
        <ellipse cx="54" cy="35" rx="3.8" ry="6.2" transform="rotate(24 54 35)" />
        <ellipse cx="66" cy="31" rx="3.8" ry="6.2" transform="rotate(-24 66 31)" />
        <ellipse cx="59" cy="25" rx="3.6" ry="6" />
      </g>
      <g stroke="#c99422" strokeWidth="1.2" strokeLinecap="round">
        <path d="M53 37 L48 24" />
        <path d="M65 32 L70 19" />
        <path d="M59 19 L59 11" />
      </g>
    </g>
  )
}

/** The logo badge: a wheat sheaf on a paper disc; `.logo` sways. */
export function LogoSheaf(): ReactElement {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="#fffdf6" stroke="rgba(80,52,23,0.3)" strokeWidth="3" />
      <g className="logo">
        <SideEar angle={-16} stem="M60 98 Q58 70 60 46" />
        <SideEar angle={16} stem="M60 98 Q62 70 60 46" />
        <g>
          <path
            d="M60 100 Q59 66 60 38"
            fill="none"
            stroke="#b97f14"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path d="M60 74 Q48 66 46 52 Q58 58 60 68 Z" fill="#6da544" />
          <g fill="#eaba3b" stroke="#b97f14" strokeWidth="1.2">
            <ellipse cx="53" cy="37" rx="4.4" ry="7.2" transform="rotate(24 53 37)" />
            <ellipse cx="67" cy="32" rx="4.4" ry="7.2" transform="rotate(-24 67 32)" />
            <ellipse cx="53" cy="26" rx="4.2" ry="6.8" transform="rotate(24 53 26)" />
            <ellipse cx="67" cy="21" rx="4.2" ry="6.8" transform="rotate(-24 67 21)" />
            <ellipse cx="60" cy="14" rx="4" ry="6.6" />
          </g>
          <g stroke="#c99422" strokeWidth="1.4" strokeLinecap="round">
            <path d="M52 28 L46 13" />
            <path d="M68 23 L74 8" />
            <path d="M60 8 L60 -1" />
          </g>
        </g>
        <path
          d="M48 84 Q60 78 72 84 Q60 92 48 84 Z"
          fill="#d6981f"
          stroke="#b97f14"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
