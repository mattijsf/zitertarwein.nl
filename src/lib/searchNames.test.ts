import { describe, expect, it } from "vitest"
import type { Product } from "../types/product"
import { searchNames } from "./searchNames"

const product: Product = {
  n: "Pindakaas",
  a: ["Calvé", "Arachide"],
  s: "no",
  i: "",
  b: "off",
  m: "Calvé",
}

describe("searchNames", () => {
  it("normalizes the name and aliases and marks the brand", () => {
    expect(searchNames(product)).toEqual([
      { name: "Pindakaas", key: "pindakaas", isBrand: false },
      { name: "Calvé", key: "calve", isBrand: true },
      { name: "Arachide", key: "arachide", isBrand: false },
    ])
  })

  it("returns the same array for the same product", () => {
    expect(searchNames(product)).toBe(searchNames(product))
  })
})
