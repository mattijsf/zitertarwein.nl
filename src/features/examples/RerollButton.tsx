import type { ReactElement } from "react"
import { useRef } from "react"
import "./RerollButton.css"

const SPIN: Keyframe[] = [{ transform: "rotate(360deg)" }]
const SPIN_OPTIONS: KeyframeAnimationOptions = { duration: 450, easing: "ease" }

export function RerollButton({ onReroll }: { onReroll: () => void }): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)
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
        onReroll()
      }}
    >
      ⟳
    </button>
  )
}
