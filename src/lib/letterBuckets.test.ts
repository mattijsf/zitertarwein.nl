import { describe, expect, it } from "vitest"
import { capitalize } from "./capitalize"
import { bucketIndexAt, bucketOf, letterBuckets } from "./letterBuckets"

describe("bucketOf", () => {
  it("uses the first letter, ignoring case, accents and punctuation", () => {
    expect(bucketOf("appel")).toBe("A")
    expect(bucketOf("'t Bakkertje")).toBe("T")
    expect(bucketOf("éclair")).toBe("E")
  })

  it("puts digits and empty names under #", () => {
    expect(bucketOf("7up")).toBe("#")
    expect(bucketOf("—")).toBe("#")
  })
})

describe("letterBuckets", () => {
  it("gives the first index per bucket", () => {
    expect(letterBuckets(["7up", "appel", "avocado", "brood", "Cola"])).toEqual([
      { label: "#", index: 0 },
      { label: "A", index: 1 },
      { label: "B", index: 3 },
      { label: "C", index: 4 },
    ])
  })
})

describe("capitalize", () => {
  it("capitalizes the first letter only", () => {
    expect(capitalize("brood van Bakker")).toBe("Brood van Bakker")
    expect(capitalize("")).toBe("")
  })
})

describe("bucketIndexAt", () => {
  it("maps a y position on the bar to a letter", () => {
    expect(bucketIndexAt(100, 100, 260, 26)).toBe(0)
    expect(bucketIndexAt(115, 100, 260, 26)).toBe(1)
    expect(bucketIndexAt(359, 100, 260, 26)).toBe(25)
  })

  it("clamps outside the bar", () => {
    expect(bucketIndexAt(0, 100, 260, 26)).toBe(0)
    expect(bucketIndexAt(1000, 100, 260, 26)).toBe(25)
  })
})
