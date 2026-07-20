import type { ReactElement } from "react"
import { useRef } from "react"
import type { LetterBucket } from "../../lib/letterBuckets"
import { bucketIndexAt } from "../../lib/letterBuckets"
import { useIndexScrub } from "./useIndexScrub"

interface Props {
  buckets: readonly LetterBucket[]
  onJump: (bucket: LetterBucket) => void
}

/** A-Z bar on the right edge: tap or drag to jump to a letter. */
export function BrowseIndex({ buckets, onJump }: Props): ReactElement {
  const barRef = useRef<HTMLDivElement>(null)
  useIndexScrub(barRef, clientY => {
    const bar = barRef.current
    if (!bar || buckets.length === 0) {
      return
    }
    const r = bar.getBoundingClientRect()
    const bucket = buckets[bucketIndexAt(clientY, r.top, r.height, buckets.length)]
    if (bucket) {
      onJump(bucket)
    }
  })
  return (
    <div ref={barRef} className="browse-index" aria-hidden="true">
      {buckets.map(bucket => (
        <span key={bucket.label}>{bucket.label}</span>
      ))}
    </div>
  )
}
