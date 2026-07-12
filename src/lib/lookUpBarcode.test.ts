import { afterEach, describe, expect, it, vi } from "vitest"
import { barcodeUrl, lookUpBarcode, parseProductResponse } from "./lookUpBarcode"

const response = (status: number, body: unknown = {}): Response =>
  new Response(JSON.stringify(body), { status })

describe("parseProductResponse", () => {
  it("reads the product when status is 1", () => {
    expect(
      parseProductResponse({ status: 1, product: { code: "87", product_name: "Drop" } })
    ).toMatchObject({ code: "87", productName: "Drop" })
  })

  it("returns null for unknown products and malformed responses", () => {
    expect(parseProductResponse({ status: 0, product: {} })).toBeNull()
    expect(parseProductResponse({ status: 1 })).toBeNull()
    expect(parseProductResponse("x")).toBeNull()
  })
})

describe("lookUpBarcode", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("asks the product endpoint for the barcode", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(response(200, { status: 1, product: { code: "87" } }))
    )
    vi.stubGlobal("fetch", fetchMock)
    expect(await lookUpBarcode("87")).toMatchObject({ kind: "found", product: { code: "87" } })
    expect(fetchMock).toHaveBeenCalledWith(barcodeUrl("87"))
    expect(barcodeUrl("87")).toMatch(/^https:\/\/nl\.openfoodfacts\.org\/api\/v2\/product\/87\?/)
  })

  it("treats 404 and status 0 as unknown", async () => {
    vi.stubGlobal("fetch", () => Promise.resolve(response(404)))
    expect(await lookUpBarcode("1")).toEqual({ kind: "unknown" })
    vi.stubGlobal("fetch", () => Promise.resolve(response(200, { status: 0 })))
    expect(await lookUpBarcode("1")).toEqual({ kind: "unknown" })
  })

  it("reports other errors as unavailable", async () => {
    vi.stubGlobal("fetch", () => Promise.resolve(response(503)))
    expect(await lookUpBarcode("1")).toEqual({ kind: "unavailable" })
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("offline")))
    expect(await lookUpBarcode("1")).toEqual({ kind: "unavailable" })
  })
})
