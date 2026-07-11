import { describe, expect, it } from "vitest"
import { offToProduct } from "./offToProduct"

describe("offToProduct", () => {
  it("adds the brand to the name, keeps the bare name as alias", () => {
    expect(offToProduct({ n: "Pindakaas", m: "Calvé", s: "no", c: "87" })).toMatchObject({
      n: "Pindakaas (Calvé)",
      a: ["Pindakaas"],
      s: "no",
      b: "off",
      url: "https://nl.openfoodfacts.org/product/87",
    })
  })

  it("leaves out a brand the name already contains", () => {
    expect(offToProduct({ n: "Calvé Pindakaas", m: "calvé", s: "no", c: "87" })?.n).toBe(
      "Calvé Pindakaas"
    )
    expect(offToProduct({ n: "Pindakaas", m: "", s: "no", c: "87" })?.n).toBe("Pindakaas")
  })

  it("explains the verdict and skips unknown statuses", () => {
    expect(offToProduct({ n: "Koek", m: "", s: "yes", c: "1" })?.i).toContain("zit hier tarwe in")
    expect(offToProduct({ n: "Koek", m: "", s: "ja", c: "1" })).toBeUndefined()
  })
})
