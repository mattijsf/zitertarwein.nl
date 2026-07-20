import { normalize } from "./normalize"

export interface LetterBucket {
  /** "A"–"Z", or "#" for names that start with a digit (or have no letters at all). */
  label: string
  /** Index of the first item in this bucket. */
  index: number
}

export function bucketOf(name: string): string {
  const c = normalize(name)[0] ?? "#"
  return /[a-z]/.test(c) ? c.toUpperCase() : "#"
}

/** First index per letter bucket, in the order the (sorted) names come in. */
export function letterBuckets(names: readonly string[]): LetterBucket[] {
  const buckets: LetterBucket[] = []
  const seen = new Set<string>()
  names.forEach((name, index) => {
    const label = bucketOf(name)
    if (!seen.has(label)) {
      seen.add(label)
      buckets.push({ label, index })
    }
  })
  return buckets
}

/** Which of `count` evenly spread index letters sits at `y` in a bar from `top`, `height` high. */
export function bucketIndexAt(y: number, top: number, height: number, count: number): number {
  const frac = Math.min(0.999, Math.max(0, (y - top) / height))
  return Math.floor(frac * count)
}
