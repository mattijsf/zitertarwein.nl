import { describe, expect, it } from "vitest"
import { readSharedTerm, shareSearch, shareText, shareUrl } from "./shareUrl"

describe("shareUrl", () => {
  it("round-trips a product name through the query string", () => {
    const search = shareSearch("Pindakaas (Calvé) & co")
    expect(search).toBe("?p=Pindakaas%20(Calv%C3%A9)%20%26%20co")
    expect(readSharedTerm(search)).toBe("Pindakaas (Calvé) & co")
  })

  it("ignores a missing or empty parameter", () => {
    expect(readSharedTerm("")).toBeNull()
    expect(readSharedTerm("?p=%20")).toBeNull()
    expect(readSharedTerm("?q=brood")).toBeNull()
  })

  it("builds the link and the text", () => {
    expect(shareUrl("https://zitertarwein.nl", "drop")).toBe("https://zitertarwein.nl/?p=drop")
    expect(shareText("drop", "Ja, tarwe!")).toBe("Zit er tarwe in drop? Ja, tarwe!")
  })
})
