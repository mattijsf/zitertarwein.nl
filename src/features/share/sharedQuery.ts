import type { CheckResult } from "../../stores/useCheckStore"

/** The search a shared link runs to show this answer again, or null for cards without one. */
export function sharedQuery(result: CheckResult | null): string | null {
  if (result?.kind === "product") {
    return result.product.n
  }
  return result?.kind === "online" ? result.term : null
}
