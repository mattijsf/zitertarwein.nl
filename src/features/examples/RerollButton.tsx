import type { ReactElement } from "react"
import { useRef, useState } from "react"
import "./RerollButton.css"

const SPIN: Keyframe[] = [{ transform: "rotate(360deg)" }]
const SPIN_OPTIONS: KeyframeAnimationOptions = { duration: 450, easing: "ease" }

/** Pip positions per face, in the 24×24 viewBox. */
const PIPS: readonly (readonly [number, number])[][] = [
  [[12, 12]],
  [
    [8, 8],
    [16, 16],
  ],
  [
    [8, 8],
    [12, 12],
    [16, 16],
  ],
  [
    [8, 8],
    [16, 8],
    [8, 16],
    [16, 16],
  ],
  [
    [8, 8],
    [16, 8],
    [12, 12],
    [8, 16],
    [16, 16],
  ],
  [
    [8, 7],
    [16, 7],
    [8, 12],
    [16, 12],
    [8, 17],
    [16, 17],
  ],
]

function throwDie(): readonly (readonly [number, number])[] {
  return PIPS[Math.floor(Math.random() * PIPS.length)] ?? []
}

/** A die that shows a random face on every throw. */
export function RerollButton({ onReroll }: { onReroll: () => void }): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)
  const [pips, setPips] = useState(throwDie)
  return (
    <button
      ref={ref}
      className="reroll-button"
      type="button"
      aria-label="Andere voorbeelden"
      title="Andere voorbeelden"
      onClick={() => {
        // a new animation each click, so it restarts mid-spin
        ref.current?.animate(SPIN, SPIN_OPTIONS)
        setPips(throwDie())
        onReroll()
      }}
    >
      <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          fill="#fffdf6"
          stroke="#503417"
          strokeWidth="2.5"
        />
        <g>
          {pips.map(([x, y]) => (
            <circle key={`${x},${y}`} cx={x} cy={y} r="2.1" fill="#503417" />
          ))}
        </g>
      </svg>
    </button>
  )
}
