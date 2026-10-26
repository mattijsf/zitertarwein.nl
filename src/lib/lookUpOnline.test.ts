import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { googleUrl } from "./googleUrl"
import type { OffProduct } from "./lookUpOnline"
import { hasWheat, lookUpOnline, parseSearchResponse, pickCandidate, toMatch } from "./lookUpOnline"

const off = (fields: Partial<OffProduct>): OffProduct => ({
  code: "123",
  productName: "",
  productNameNl: "",
  brands: "",
  ingredientsText: "",
  ingredientsTextNl: "",
  allergensTags: [],
  ingredientsTags: [],
  imageFrontUrl: "",
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
    expect(hasWheat(off({ ingredientsText: "farine de froment" }))).toBe(true)
    expect(hasWheat(off({ ingredientsText: "rijst, water, zout" }))).toBe(false)
  })

  it("reads blé only as a whole word", () => {
    expect(hasWheat(off({ ingredientsText: "farine de blé, sucre" }))).toBe(true)
    expect(hasWheat(off({ ingredientsText: "Blé complet" }))).toBe(true)
    expect(hasWheat(off({ ingredientsText: "farine de ble" }))).toBe(true)
    expect(hasWheat(off({ ingredientsText: "vegetable oil, soluble fibre" }))).toBe(false)
    expect(hasWheat(off({ ingredientsText: "sustainable palm oil" }))).toBe(false)
    expect(hasWheat(off({ ingredientsText: "sirop d'érable" }))).toBe(false)
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
      photo: null,
    })
  })

  it("keeps the pack photo when Open Food Facts has one", () => {
    const photo = "https://images.openfoodfacts.org/images/products/87/front_nl.jpg"
    expect(toMatch(off({ imageFrontUrl: photo }), "pinda").photo).toBe(photo)
  })

  it("decodes HTML entities in the name", () => {
    expect(toMatch(off({ productName: "Pindakaas &amp; jam" }), "pinda").name).toBe(
      "Pindakaas & jam"
    )
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

describe("lookUpOnline", () => {
  const ok = (json: unknown): Response => Response.json(json)
  const found = { products: [{ code: "1", product_name: "Koek", ingredients_text: "tarwebloem" }] }

  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("returns the first product with ingredients", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(found)))
    expect(await lookUpOnline("koek")).toEqual({
      kind: "found",
      match: {
        name: "Koek",
        url: "https://nl.openfoodfacts.org/product/1",
        hasWheat: true,
        photo: null,
      },
    })
  })

  it("reports not found when nothing has ingredients", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok({ products: [{ code: "1" }] })))
    expect(await lookUpOnline("koek")).toEqual({ kind: "notFound" })
  })

  it("retries once after a failure", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(ok(found))
    vi.stubGlobal("fetch", fetchMock)
    const lookup = lookUpOnline("koek")
    await vi.advanceTimersByTimeAsync(4000)
    expect((await lookup)?.kind).toBe("found")
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("reports an outage when the retry fails too", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    const lookup = lookUpOnline("koek")
    await vi.advanceTimersByTimeAsync(4000)
    expect(await lookup).toEqual({ kind: "unavailable" })
  })

  it("gives up silently once the search is stale", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 502 }))
    vi.stubGlobal("fetch", fetchMock)
    let current = true
    const lookup = lookUpOnline("koek", () => current)
    await vi.advanceTimersByTimeAsync(0)
    current = false
    await vi.advanceTimersByTimeAsync(4000)
    expect(await lookup).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
