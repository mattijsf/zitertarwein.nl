import { describe, expect, it } from "vitest"
import type { Product, Verdict } from "../types/product"
import { browseLists } from "./browseLists"

const product = (n: string, s: Verdict, url?: string): Product => ({
  n,
  a: [],
  s,
  i: "",
  b: "ncv",
  ...(url === undefined ? {} : { url }),
})

describe("browseLists", () => {
  const products = [
    product("Zoute koekjes (Merk)", "yes", "https://example.org/1"),
    product("brood", "yes"),
    product("Appelsap (Merk)", "no", "https://example.org/2"),
    product("appel", "no"),
    product("haver", "check"),
  ]
  const lists = browseLists(products)

  it("sorts alphabetically, curated and supermarket products mixed", () => {
    expect(lists.all.map(p => p.n)).toEqual([
      "appel",
      "Appelsap (Merk)",
      "brood",
      "haver",
      "Zoute koekjes (Merk)",
    ])
  })

  it("splits by verdict, keeping the order", () => {
    expect(lists.yes.map(p => p.n)).toEqual(["brood", "Zoute koekjes (Merk)"])
    expect(lists.no.map(p => p.n)).toEqual(["appel", "Appelsap (Merk)"])
  })

  it("ignores case and punctuation", () => {
    const sorted = browseLists([product("Zz", "no"), product("a-b", "no"), product("AA", "no")])
    expect(sorted.all.map(p => p.n)).toEqual(["AA", "a-b", "Zz"])
  })
})
