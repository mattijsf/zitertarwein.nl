import type { Verdict } from "../types/product"

/** The answer line for each verdict, in the app and on the /p/ pages. */
export const VERDICT: Record<Verdict, string> = {
  yes: "Ja, tarwe",
  no: "Geen tarwe",
  check: "Check het etiket",
}
