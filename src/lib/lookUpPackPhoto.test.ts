import { afterEach, describe, expect, it, vi } from "vitest"
import { lookUpPackPhoto, packPhotoUrl, parsePackPhoto } from "./lookUpPackPhoto"

const PHOTO = "https://images.openfoodfacts.org/images/products/871/front_nl.4.400.jpg"

describe("parsePackPhoto", () => {
  it("reads the front photo", () => {
    expect(parsePackPhoto({ product: { image_front_url: PHOTO } })).toBe(PHOTO)
  })

  it("returns null when there is no usable photo", () => {
    expect(parsePackPhoto(null)).toBeNull()
    expect(parsePackPhoto({ status: 0 })).toBeNull()
    expect(parsePackPhoto({ product: { image_front_url: "" } })).toBeNull()
    expect(parsePackPhoto({ product: { image_front_url: 5 } })).toBeNull()
  })
})

describe("lookUpPackPhoto", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("asks only for the photo field", () => {
    expect(packPhotoUrl("87 1")).toBe(
      "https://nl.openfoodfacts.org/api/v2/product/87%201?fields=image_front_url"
    )
  })

  it("resolves the photo, or null on an error status or a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(Response.json({ product: { image_front_url: PHOTO } })))
    )
    expect(await lookUpPackPhoto("871")).toBe(PHOTO)
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("", { status: 404 })))
    )
    expect(await lookUpPackPhoto("871")).toBeNull()
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("offline")))
    )
    expect(await lookUpPackPhoto("871")).toBeNull()
  })
})
