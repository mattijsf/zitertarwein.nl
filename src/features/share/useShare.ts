import { shareProduct } from "./shareProduct"
import { useCopied } from "./useCopied"

export interface ShareTarget {
  name: string
  verdict: string
  /** The search the link runs; differs from the name for online answers. */
  query: string
}

/** Shares an answer; `copied` is true for a moment after the clipboard fallback. */
export function useShare({ name, verdict, query }: ShareTarget): {
  copied: boolean
  share: () => void
} {
  const [copied, setCopied] = useCopied()
  const share = (): void => {
    shareProduct(name, verdict, query).then(
      outcome => {
        setCopied(outcome === "copied")
      },
      () => {
        // clipboard refused: nothing to show
      }
    )
  }
  return { copied, share }
}
