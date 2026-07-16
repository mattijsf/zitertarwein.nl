import { describe, expect, it } from "vitest"
import { normalize } from "./normalize"
import { normalizeWithMap } from "./normalizeWithMap"

describe("normalize", () => {
  it("strips case, accents, punctuation and whitespace", () => {
    expect(normalize("B'tween")).toBe("btween")
    expect(normalize("m&m's")).toBe("mms")
    expect(normalize(" Coca-Cola ")).toBe("cocacola")
    expect(normalize("Crème brûlée")).toBe("cremebrulee")
  })
})

describe("normalizeWithMap", () => {
  it("maps each normalized character to its original index", () => {
    expect(normalizeWithMap("B'tw é")).toEqual({ out: "btwe", map: [0, 2, 3, 5] })
  })

  it("matches normalize", () => {
    for (const s of ["B'tween", "Coca-Cola Zero", "Pâté (Zwan)"]) {
      expect(normalizeWithMap(s).out).toBe(normalize(s))
    }
  })
})
