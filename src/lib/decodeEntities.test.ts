import { describe, expect, it } from "vitest"
import { decodeEntities } from "./decodeEntities"

describe("decodeEntities", () => {
  it("decodes numeric and named entities", () => {
    expect(decodeEntities("Ben &amp; Jerry&#039;s")).toBe("Ben & Jerry's")
    expect(decodeEntities("Lay&#x27;s &quot;Paprika&quot;")).toBe('Lay\'s "Paprika"')
  })

  it("leaves plain text and unknown entities alone", () => {
    expect(decodeEntities("M&M's")).toBe("M&M's")
    expect(decodeEntities("a &bogus; b")).toBe("a &bogus; b")
  })
})
