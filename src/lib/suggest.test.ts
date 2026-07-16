import { describe, expect, it } from "vitest"
import type { Product } from "../types/product"
import { findProduct } from "./findProduct"
import { suggest } from "./suggest"

const product = (n: string, a: string[] = []): Product => ({ n, a, s: "no", i: "", b: "ncv" })

const products = [product("rijst"), product("brood", ["roggebrood"]), product("croissant")]

describe("suggest", () => {
  it("ranks prefix matches before substring matches", () => {
    expect(suggest("r", products).map(s => s.name)).toEqual(["rijst", "roggebrood", "croissant"])
  })

  it("shows the alias that matched", () => {
    expect(suggest("rogge", products)[0]?.name).toBe("roggebrood")
  })

  it("ignores case and accents", () => {
    expect(suggest("CRÔ", products)[0]?.name).toBe("croissant")
  })

  it("ignores punctuation and whitespace", () => {
    const list = [product("B'tween"), product("Coca-Cola")]
    expect(suggest("btween", list)[0]?.name).toBe("B'tween")
    expect(suggest("coca cola", list)[0]?.name).toBe("Coca-Cola")
  })

  it("shows the product name, not the brand, on a brand match", () => {
    const pasta: Product = { ...product("Penne (Barilla)", ["Penne", "Barilla"]), m: "Barilla" }
    expect(suggest("barilla", [pasta])[0]?.name).toBe("Penne (Barilla)")
  })

  it("tolerates typos", () => {
    const list = [product("stroopwafel"), product("kroket")]
    expect(suggest("stropwafel", list).map(s => [s.name, s.score])).toEqual([["stroopwafel", 3]])
    // also on the start of a longer name
    expect(suggest("krok", list)[0]?.name).toBe("kroket")
    expect(suggest("kroet", list)[0]?.score).toBe(3)
    // short terms are left alone
    expect(suggest("krt", list)).toEqual([])
  })

  it("mixes typo matches in after the regular hits", () => {
    const list = [product("kroket"), product("krokant"), product("bitterbal")]
    // krokant starts with "kroka"; kroket is one edit away
    expect(suggest("kroka", list).map(s => [s.name, s.score])).toEqual([
      ["krokant", 0],
      ["kroket", 3],
    ])
  })

  it("returns nothing for an empty term", () => {
    expect(suggest("  ", products)).toEqual([])
  })
})

describe("findProduct", () => {
  it("matches names and aliases exactly", () => {
    expect(findProduct("Roggebrood ", products)?.n).toBe("brood")
    expect(findProduct("rog", products)).toBeUndefined()
  })
})
