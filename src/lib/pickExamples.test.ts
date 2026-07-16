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
    product("c", "yes"),
    product("d", "no"),
    product("e", "no"),
    product("f", "check"),
    product("g", "check"),
    product("kaal", "no", "Geen tarwe."),
  ]

  it("takes two of each verdict", () => {
    const picked = pickExamples(products).examples
    expect(picked).toHaveLength(6)
    for (const s of ["yes", "no", "check"] as const) {
      expect(picked.filter(p => p.s === s)).toHaveLength(2)
    }
  })

  it("skips products without a story", () => {
    for (let i = 0; i < 20; i++) {
      expect(pickExamples(products).examples.map(p => p.n)).not.toContain("kaal")
    }
  })

  it("skips recently shown products while enough fresh ones are left", () => {
    const verdicts: Verdict[] = ["yes", "no", "check"]
    const many = verdicts.flatMap(s =>
      ["1", "2", "3", "4", "5", "6"].map(i => product(`${s}${i}`, s))
    )
    const first = pickExamples(many)
    expect(first.recent.size).toBe(6)
    const second = pickExamples(many, first.recent)
    for (const p of second.examples) {
      expect(first.recent.has(p.n)).toBe(false)
    }
    expect(second.recent.size).toBe(12)
  })

  it("starts over when a verdict runs out of fresh products", () => {
    const recent = new Set(["a", "b"])
    const { examples, recent: next } = pickExamples(products, recent)
    expect(examples).toHaveLength(6)
    expect(next.size).toBe(6)
  })
})
