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
}

const INFO: Record<Verdict, string> = {
  yes: "Volgens de ingrediëntenlijst op het etiket zit hier tarwe in.",
  no: "Geen tarwe gevonden in de ingrediëntenlijst. Automatisch gelezen uit etiketdata — check bij twijfel zelf het etiket.",
  check:
    "Het etiket geeft geen zeker antwoord (wel gluten of sporen, geen duidelijke tarwe). Check de verpakking.",
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
    a: [o.n],
    s: o.s,
    i: INFO[o.s],
    b: "off",
    url: offProductUrl(o.c),
  }
}
