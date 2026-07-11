import { describe, expect, it } from "vitest"
import { googleUrl } from "./googleUrl"
import type { OffProduct } from "./lookUpOnline"
import { hasWheat, parseSearchResponse, pickCandidate, toMatch } from "./lookUpOnline"

const off = (fields: Partial<OffProduct>): OffProduct => ({
  code: "123",
  productName: "",
  productNameNl: "",
  brands: "",
  ingredientsText: "",
  ingredientsTextNl: "",
  allergensTags: [],
  ingredientsTags: [],
  ...fields,
})

describe("parseSearchResponse", () => {
  it("reads products and drops fields of the wrong type", () => {
    const [p] = parseSearchResponse({
      products: [
        { code: "87", product_name: "Pindakaas", brands: 5, allergens_tags: ["en:peanuts", 1] },
      ],
    })
    expect(p).toEqual(off({ code: "87", productName: "Pindakaas", allergensTags: ["en:peanuts"] }))
  })

  it("returns nothing for malformed responses", () => {
    expect(parseSearchResponse(null)).toEqual([])
    expect(parseSearchResponse({ products: "x" })).toEqual([])
  })
})

describe("pickCandidate", () => {
  it("skips products without ingredients", () => {
    const empty = off({ code: "1", ingredientsText: "  " })
    const tagged = off({ code: "2", ingredientsTags: ["en:sugar"] })
    expect(pickCandidate([empty, tagged])?.code).toBe("2")
    expect(pickCandidate([empty])).toBeUndefined()
  })
})

describe("hasWheat", () => {
  it("finds wheat words in the ingredient text", () => {
    expect(hasWheat(off({ ingredientsTextNl: "TARWEBLOEM, suiker" }))).toBe(true)
    expect(hasWheat(off({ ingredientsText: "farine de blé" }))).toBe(true)
    expect(hasWheat(off({ ingredientsText: "rijst, water, zout" }))).toBe(false)
  })

  it("prefers the Dutch ingredient text", () => {
    expect(hasWheat(off({ ingredientsTextNl: "rijst", ingredientsText: "wheat" }))).toBe(false)
  })

  it("finds wheat in the tags", () => {
    expect(hasWheat(off({ allergensTags: ["en:gluten", "en:wheat"] }))).toBe(true)
    expect(hasWheat(off({ ingredientsTags: ["en:triticum-durum"] }))).toBe(true)
  })
})

describe("toMatch", () => {
  it("names the product with its first brand", () => {
    const match = toMatch(
      off({ code: "8 7", productName: "Pindakaas", brands: "Calvé, Unilever" }),
      "pinda"
    )
    expect(match).toEqual({
      name: "Pindakaas (Calvé)",
      url: "https://nl.openfoodfacts.org/product/8%207",
      hasWheat: false,
    })
  })

  it("falls back to the search term", () => {
    expect(toMatch(off({}), "pinda").name).toBe("pinda")
  })
})

it("googleUrl asks the question", () => {
  expect(googleUrl("pinda")).toBe(
    "https://www.google.com/search?q=Zit%20er%20tarwe%20in%20pinda%3F"
  )
})
