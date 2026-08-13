import { describe, expect, it } from "vitest"
import type { Product, Verdict } from "../types/product"
import { pickExamples } from "./pickExamples"
import { pickRandom } from "./pickRandom"

const story = "Een verhaaltje van meer dan dertig tekens lang."
const product = (n: string, s: Verdict, i = story): Product => ({ n, a: [], s, i, b: "ncv" })

describe("pickRandom", () => {
  it("picks distinct items", () => {
    const picked = pickRandom([1, 2, 3, 4], 3)
    expect(new Set(picked).size).toBe(3)
  })

  it("stops when the list runs out", () => {
    expect(pickRandom([1, 2], 5)).toHaveLength(2)
  })

  it("uses the given random source", () => {
    expect(pickRandom(["a", "b", "c"], 3, () => 0)).toEqual(["a", "b", "c"])
  })
})

describe("pickExamples", () => {
  const products = [
    product("a", "yes"),
    product("b", "yes"),
    product("c", "no"),
    product("d", "check"),
    product("kaal", "no", "Geen tarwe."),
  ]

  it("takes one of each verdict", () => {
    const picked = pickExamples(products)
    expect(picked).toHaveLength(3)
    for (const s of ["yes", "no", "check"] as const) {
      expect(picked.filter(p => p.s === s)).toHaveLength(1)
    }
  })

  it("skips products without a story", () => {
    for (let i = 0; i < 20; i++) {
      expect(pickExamples(products).map(p => p.n)).not.toContain("kaal")
    }
  })
})
