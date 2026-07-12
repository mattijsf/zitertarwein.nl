import { describe, expect, it } from "vitest"
import { offToProduct } from "./offToProduct"

describe("offToProduct", () => {
  it("adds the brand to the name, keeps the bare name and the brand as aliases", () => {
    expect(offToProduct({ n: "Pindakaas", m: "Calvé", s: "no", c: "87" })).toMatchObject({
      n: "Pindakaas (Calvé)",
      a: ["Pindakaas", "Calvé"],
      m: "Calvé",
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

  it("names the wheat word it found and explains gluten-free claims", () => {
    expect(offToProduct({ n: "Koek", m: "", s: "yes", c: "1", w: "speltmeel" })?.i).toContain(
      "tarwe in (gevonden: “speltmeel”)."
    )
    expect(offToProduct({ n: "Brood", m: "", s: "check", c: "1", gv: 1 })?.i).toContain(
      "claimt óók glutenvrij"
    )
  })

  it("tells traces apart from gluten without wheat", () => {
    expect(offToProduct({ n: "Reep", m: "", s: "check", c: "1", sp: 1 })?.i).toContain("sporen")
    expect(offToProduct({ n: "Koek", m: "", s: "check", c: "1" })?.i).toContain("rogge of gerst")
  })
})
