import { beforeEach, describe, expect, it, vi } from "vitest"
import type { OnlineLookup, OnlineMatch } from "../lib/lookUpOnline"
import type { Product } from "../types/product"
import { useCatalogStore } from "./useCatalogStore"
import { useCheckStore } from "./useCheckStore"

const lookUpOnline = vi.hoisted(() =>
  vi.fn<(term: string, isCurrent: () => boolean) => Promise<OnlineLookup | undefined>>()
)

vi.mock("../lib/lookUpOnline", async importOriginal => ({
  ...(await importOriginal<object>()),
  lookUpOnline,
}))

const stroopwafel: Product = { n: "Stroopwafel", a: [], s: "yes", i: "", b: "vc-tarwe" }
const sojasaus: Product = { n: "Sojasaus", a: ["shoyu"], s: "check", i: "", b: "vc-tarwe" }
const match: OnlineMatch = { name: "Pindakaas (Calvé)", url: "", hasWheat: false }

/** A lookup the test answers by hand. */
function pendingLookup(): (answer: OnlineLookup | undefined) => Promise<void> {
  let answer: (value: OnlineLookup | undefined) => void = () => undefined
  let isCurrent: () => boolean = () => false
  lookUpOnline.mockImplementationOnce((_term, current) => {
    isCurrent = current
    return new Promise(resolve => {
      answer = resolve
    })
  })
  return async value => {
    answer(isCurrent() ? value : undefined)
    await Promise.resolve()
  }
}

beforeEach(() => {
  lookUpOnline.mockReset()
  useCatalogStore.setState({ products: [stroopwafel, sojasaus] })
  useCheckStore.setState({ query: "", suggestionsOpen: false, activeIndex: -1, result: null })
})

describe("check", () => {
  it("shows an exact match on an alias", () => {
    useCheckStore.getState().check("Shoyu")
    expect(useCheckStore.getState().result).toEqual({ kind: "product", product: sojasaus })
    expect(lookUpOnline).not.toHaveBeenCalled()
  })

  it("takes the first prefix suggestion and fills in its name", () => {
    useCheckStore.getState().check("stroop")
    const { result, query } = useCheckStore.getState()
    expect(result).toEqual({ kind: "product", product: stroopwafel })
    expect(query).toBe("Stroopwafel")
  })

  it("fixes a typo", () => {
    useCheckStore.getState().check("stropwafel")
    expect(useCheckStore.getState().result).toEqual({ kind: "product", product: stroopwafel })
  })

  it("looks up unknown products online", async () => {
    const answer = pendingLookup()
    useCheckStore.getState().check("pindakaas")
    expect(useCheckStore.getState().result).toEqual({ kind: "searching", term: "pindakaas" })
    await answer({ kind: "found", match })
    expect(useCheckStore.getState().result).toEqual({ kind: "online", term: "pindakaas", match })
  })

  it("drops an online answer for an older search", async () => {
    const answer = pendingLookup()
    useCheckStore.getState().check("pindakaas")
    useCheckStore.getState().check("stroopwafel")
    await answer({ kind: "found", match })
    expect(useCheckStore.getState().result).toEqual({ kind: "product", product: stroopwafel })
  })

  it("bumps resultId for every shown result", () => {
    const before = useCheckStore.getState().resultId
    useCheckStore.getState().check("stroopwafel")
    useCheckStore.getState().check("sojasaus")
    expect(useCheckStore.getState().resultId).toBe(before + 2)
  })
})
