import type { Product, Verdict } from "../types/product"
import { offProductUrl } from "./offProductUrl.ts"

/** A supermarket product from the Open Food Facts import (src/data/off-products.json). */
export interface OffEntry {
  /** name */
  n: string
  /** brand, may be empty */
  m: string
  /** verdict as read from the label */
  s: string
  /** barcode */
  c: string
  /** 1 when the "check" verdict only comes from possible traces */
  sp?: number | undefined
}

function offInfo(s: Verdict, traces: boolean): string {
  switch (s) {
    case "yes":
      return "Volgens de ingrediëntenlijst op het etiket zit hier tarwe in."
    case "no":
      return "Geen tarwe gevonden in de ingrediëntenlijst. Automatisch gelezen uit etiketdata — check bij twijfel zelf het etiket."
    case "check":
      return traces
        ? "Geen tarwe als ingrediënt, maar het etiket waarschuwt voor mogelijke sporen. Check de verpakking."
        : "Het etiket vermeldt gluten (bijvoorbeeld rogge of gerst) zonder duidelijke tarwe-vermelding. Check de verpakking."
  }
}

function isVerdict(s: string): s is Verdict {
  return s === "yes" || s === "no" || s === "check"
}

/** Turns an import entry into a searchable product; undefined for an unknown status. */
export function offToProduct(o: OffEntry): Product | undefined {
  if (!isVerdict(o.s)) {
    return undefined
  }
  return {
    n: o.m && !o.n.toLowerCase().includes(o.m.toLowerCase()) ? `${o.n} (${o.m})` : o.n,
    a: o.m ? [o.n, o.m] : [o.n],
    m: o.m,
    s: o.s,
    i: offInfo(o.s, Boolean(o.sp)),
    b: "off",
    url: offProductUrl(o.c),
  }
}
