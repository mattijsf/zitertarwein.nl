import type { SourceId } from "../data/sources"

/** "yes" = contains wheat, "no" = wheat-free, "check" = depends, check the label. */
export type Verdict = "yes" | "no" | "check"

export interface Source {
  name: string
  url: string
}

/** A hand-curated product. Short keys keep the data file compact. */
export interface Product {
  /** name */
  n: string
  /** aliases */
  a: readonly string[]
  /** verdict */
  s: Verdict
  /** explanation (Dutch) */
  i: string
  /** source */
  b: SourceId
  /** Page for this exact product (Open Food Facts), shown instead of the general source. */
  url?: string
  /** Brand (supermarket products); also a search alias. */
  m?: string
}
