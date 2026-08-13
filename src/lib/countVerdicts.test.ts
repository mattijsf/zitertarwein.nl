import { describe, expect, it } from "vitest"
import type { Product } from "../types/product"
import { countVerdicts } from "./countVerdicts"

const product = (n: string, s: Product["s"]): Product => ({ n, a: [], s, i: "", b: "off" })

describe("countVerdicts", () => {
  it("counts all products and the yes/no verdicts, leaving check out of both", () => {
    const products = [
      product("brood", "yes"),
      product("pasta", "yes"),
      product("rijst", "no"),
      product("drop", "check"),
    ]
    expect(countVerdicts(products)).toEqual({ total: 4, yes: 2, no: 1 })
  })

  it("is all zero for an empty catalog", () => {
    expect(countVerdicts([])).toEqual({ total: 0, yes: 0, no: 0 })
  })
})
