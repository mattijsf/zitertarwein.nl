/**
 * Code 39: each character is 9 elements (bar, space, bar, …, bar), 3 of them wide. Patterns are
 * written n/w per element, bars and spaces alternating.
 */
const PATTERNS: Readonly<Record<string, string>> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  $: "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn",
}

export interface Bar {
  x: number
  width: number
}

export interface Code39 {
  bars: Bar[]
  /** Total width, from the left edge of the first bar to the right edge of the last. */
  width: number
}

/**
 * Bars for `text` wrapped in the * start/stop character. Wide elements are `ratio` times the
 * narrow one; characters are separated by one narrow space.
 */
export function code39(text: string, narrow = 2, ratio = 3): Code39 {
  const bars: Bar[] = []
  let x = 0
  for (const char of `*${text.toUpperCase()}*`) {
    const pattern = PATTERNS[char]
    if (pattern === undefined) {
      throw new Error(`Code 39 cannot encode "${char}"`)
    }
    if (x > 0) {
      x += narrow // gap between characters
    }
    let isBar = true
    for (const element of pattern) {
      const width = element === "w" ? narrow * ratio : narrow
      if (isBar) {
        bars.push({ x, width })
      }
      x += width
      isBar = !isBar
    }
  }
  return { bars, width: x }
}
