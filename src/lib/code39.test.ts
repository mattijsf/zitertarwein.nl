import { describe, expect, it } from "vitest"
import type { Bar } from "./code39"
import { code39 } from "./code39"

const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%"

/** Element widths (bar, space, bar, …) of one encoded character, read back from the bars. */
function elements(bars: readonly Bar[]): number[] {
  const widths: number[] = []
  bars.forEach((bar, i) => {
    const next = bars[i + 1]
    widths.push(bar.width)
    if (next) {
      widths.push(next.x - bar.x - bar.width)
    }
  })
  return widths
}

describe("code39", () => {
  it("draws GEEN TARWE exactly as the hand-checked footer barcode", () => {
    const { bars, width } = code39("GEEN TARWE")
    expect(width).toBe(382)
    expect(bars).toEqual([
      { x: 0, width: 2 },
      { x: 8, width: 2 },
      { x: 12, width: 6 },
      { x: 20, width: 6 },
      { x: 28, width: 2 },
      { x: 32, width: 2 },
      { x: 36, width: 2 },
      { x: 40, width: 2 },
      { x: 48, width: 6 },
      { x: 56, width: 6 },
      { x: 64, width: 6 },
      { x: 72, width: 2 },
      { x: 76, width: 6 },
      { x: 88, width: 2 },
      { x: 92, width: 2 },
      { x: 96, width: 6 },
      { x: 104, width: 2 },
      { x: 108, width: 6 },
      { x: 120, width: 2 },
      { x: 124, width: 2 },
      { x: 128, width: 2 },
      { x: 132, width: 2 },
      { x: 136, width: 6 },
      { x: 144, width: 2 },
      { x: 152, width: 6 },
      { x: 160, width: 2 },
      { x: 168, width: 6 },
      { x: 176, width: 2 },
      { x: 180, width: 6 },
      { x: 188, width: 2 },
      { x: 192, width: 2 },
      { x: 196, width: 2 },
      { x: 200, width: 6 },
      { x: 208, width: 6 },
      { x: 220, width: 2 },
      { x: 224, width: 6 },
      { x: 232, width: 2 },
      { x: 236, width: 2 },
      { x: 244, width: 2 },
      { x: 248, width: 6 },
      { x: 256, width: 6 },
      { x: 264, width: 2 },
      { x: 268, width: 2 },
      { x: 272, width: 6 },
      { x: 284, width: 2 },
      { x: 288, width: 6 },
      { x: 300, width: 6 },
      { x: 308, width: 2 },
      { x: 312, width: 2 },
      { x: 316, width: 2 },
      { x: 320, width: 6 },
      { x: 328, width: 2 },
      { x: 332, width: 6 },
      { x: 344, width: 2 },
      { x: 348, width: 2 },
      { x: 352, width: 2 },
      { x: 360, width: 2 },
      { x: 364, width: 6 },
      { x: 372, width: 6 },
      { x: 380, width: 2 },
    ])
  })

  it("gives every character 9 elements, 3 of them wide", () => {
    for (const char of CHARSET) {
      // start * + char + stop *: the middle 5 bars are the character
      const charBars = code39(char).bars.slice(5, 10)
      const widths = elements(charBars)
      expect(widths).toHaveLength(9)
      expect(widths.filter(w => w === 6)).toHaveLength(3)
      // two wide bars and one wide space, except $ / + % (three wide spaces)
      const wideBars = charBars.filter(bar => bar.width === 6).length
      expect(wideBars).toBe("$/+%".includes(char) ? 0 : 2)
    }
  })

  it("encodes each character differently", () => {
    const shapes = new Set<string>()
    for (const char of CHARSET) {
      shapes.add(JSON.stringify(elements(code39(char).bars.slice(5, 10))))
    }
    expect(shapes.size).toBe(CHARSET.length)
  })

  it("upper-cases and rejects characters outside the set", () => {
    expect(code39("geen")).toEqual(code39("GEEN"))
    expect(() => code39("é")).toThrow()
  })
})
