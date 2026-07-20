import type { ReactElement } from "react"
import { useLayoutEffect, useRef, useState } from "react"
import type { LetterBucket } from "../../lib/letterBuckets"
import { bucketIndexAt } from "../../lib/letterBuckets"
import { useIndexScrub } from "./useIndexScrub"

interface Props {
  buckets: readonly LetterBucket[]
  onJump: (bucket: LetterBucket) => void
}

/** Keeps the bubble this far (px) inside the ends of the bar. */
const BUBBLE_INSET = 20

/**
 * A-Z bar on the right edge (plus an invisible scrub zone on the left): tap or drag to jump to a
 * letter. The bar defines the vertical mapping for both. While scrubbing, the current letter
 * grows and a bubble next to the finger shows it, popping on each change.
 */
export function BrowseIndex({ buckets, onJump }: Props): ReactElement {
  const barRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  // read by the scrub handler between renders: same letter means no re-jump/re-pop
  const activeRef = useRef<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  // the bubble keeps its last letter and position while it fades out
  const [bubble, setBubble] = useState<{ label: string; top: number } | null>(null)
  const [popId, setPopId] = useState(0)

  useLayoutEffect(() => {
    // restart the pop animation on every letter change
    for (const animation of bubbleRef.current?.getAnimations() ?? []) {
      if (animation instanceof CSSAnimation) {
        animation.currentTime = 0
        animation.play()
      }
    }
  }, [popId])

  useIndexScrub(barRef, leftRef, {
    onScrub: clientY => {
      const bar = barRef.current
      if (!bar || buckets.length === 0) {
        return
      }
      const r = bar.getBoundingClientRect()
      const bucket = buckets[bucketIndexAt(clientY, r.top, r.height, buckets.length)]
      if (!bucket || bucket.label === activeRef.current) {
        return
      }
      activeRef.current = bucket.label
      setActive(bucket.label)
      if ("vibrate" in navigator) {
        navigator.vibrate(1) // very soft haptic tick per letter
      }
      const bodyTop = bar.parentElement?.getBoundingClientRect().top ?? 0
      const y = Math.min(Math.max(clientY, r.top + BUBBLE_INSET), r.bottom - BUBBLE_INSET)
      setBubble({ label: bucket.label, top: y - bodyTop })
      setPopId(id => id + 1)
      onJump(bucket)
    },
    onEnd: () => {
      activeRef.current = null
      setActive(null)
    },
  })

  return (
    <>
      <div ref={leftRef} className="browse-scrub-left" aria-hidden="true" />
      <div ref={barRef} className="browse-index" aria-hidden="true">
        {buckets.map(bucket => (
          <span key={bucket.label} className={bucket.label === active ? "active" : undefined}>
            {bucket.label}
          </span>
        ))}
      </div>
      <div
        ref={bubbleRef}
        className={`browse-bubble${active === null ? "" : " show"}${popId > 0 ? " pop" : ""}`}
        style={bubble ? { top: bubble.top } : undefined}
        aria-hidden="true"
      >
        {bubble?.label}
      </div>
    </>
  )
}
