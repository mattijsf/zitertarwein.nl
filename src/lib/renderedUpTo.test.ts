import { describe, expect, it } from "vitest"
import { renderedUpTo } from "./renderedUpTo"

describe("renderedUpTo", () => {
  it("adds whole chunks until the index is rendered", () => {
    expect(renderedUpTo(60, 59, 500, 60)).toBe(60)
    expect(renderedUpTo(60, 60, 500, 60)).toBe(120)
    expect(renderedUpTo(60, 250, 500, 60)).toBe(300)
  })

  it("stops at the end of the list", () => {
    expect(renderedUpTo(60, 499, 130, 60)).toBe(130)
  })
})
