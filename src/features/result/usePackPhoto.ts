import { useEffect, useState } from "react"
import { lookUpPackPhoto } from "../../lib/lookUpPackPhoto"
import type { CheckResult } from "../../stores/useCheckStore"

export interface PackPhoto {
  /** The photo to show for this result, null for none (yet). */
  url: string | null
  /** The image failed to load: drop it. */
  onError: () => void
}

/**
 * The real pack photo for a result, when Open Food Facts has one. A supermarket product's photo
 * is fetched after the answer renders, so the verdict never waits on it, and is dropped if the
 * answer has changed meanwhile. An online match brings its photo along.
 */
export function usePackPhoto(result: CheckResult | null): PackPhoto {
  const [fetched, setFetched] = useState<{ for: CheckResult; url: string | null } | null>(null)
  const [failed, setFailed] = useState<CheckResult | null>(null)
  const code = result?.kind === "product" ? result.product.c : undefined

  useEffect(() => {
    if (!result || !code) {
      return
    }
    let current = true
    void lookUpPackPhoto(code).then(url => {
      if (current) {
        setFetched({ for: result, url })
      }
    })
    return () => {
      current = false
    }
  }, [result, code])

  let url: string | null = null
  if (result?.kind === "online") {
    url = result.match.photo
  } else if (fetched?.for === result) {
    url = fetched.url
  }
  return {
    url: result && failed !== result ? url : null,
    onError: () => {
      setFailed(result)
    },
  }
}
