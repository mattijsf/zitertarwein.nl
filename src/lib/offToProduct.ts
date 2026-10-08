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
  /** the wheat word found on the label, when it is not plain "tarwe" */
  w?: string | undefined
  /** 1 when the label names wheat but also claims gluten-free */
  gv?: number | undefined
}

function offInfo(o: OffEntry, s: Verdict): string {
  const evidence = o.w ? ` (gevonden: “${o.w}”)` : ""
  if (o.gv) {
    return `Het etiket noemt tarwe${evidence} maar claimt óók glutenvrij — meestal is dat glutenvrij tarwezetmeel, vrijwel zonder tarwe-eiwit. Heb je een tarweallergie? Check de verpakking extra goed.`
  }
  switch (s) {
    case "yes":
      return `Volgens de ingrediëntenlijst op het etiket zit hier tarwe in${evidence}.`
    case "no":
      return "Geen tarwe gevonden in de ingrediëntenlijst. Automatisch gelezen uit etiketdata — check bij twijfel zelf het etiket."
    case "check":
      return o.sp
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
    i: offInfo(o, o.s),
    b: "off",
    c: o.c,
    url: offProductUrl(o.c),
  }
}
