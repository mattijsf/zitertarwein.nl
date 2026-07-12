import { describe, expect, it } from "vitest"
import { editDistance } from "./editDistance"

describe("editDistance", () => {
  it("counts insertions, deletions and substitutions", () => {
    expect(editDistance("stropwafel", "stroopwafel", 2)).toBe(1)
    expect(editDistance("kroket", "kroket", 2)).toBe(0)
    expect(editDistance("pizza", "piza", 2)).toBe(1)
    expect(editDistance("brood", "braad", 2)).toBe(2)
  })

  it("stops at max + 1", () => {
    expect(editDistance("appel", "banaan", 1)).toBe(2)
    expect(editDistance("a", "abcdef", 2)).toBe(3)
  })
})
