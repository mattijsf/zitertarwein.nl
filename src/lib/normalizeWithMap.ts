export interface NormalizedWithMap {
  /** Same result as normalize(). */
  out: string
  /** For each character of `out`, its index in the original string. */
  map: number[]
}

/** normalize() with an index map back to the original string, for highlighting matches. */
export function normalizeWithMap(s: string): NormalizedWithMap {
  const map: number[] = []
  let out = ""
  for (let i = 0; i < s.length; i++) {
    for (const c of s.charAt(i).toLowerCase().normalize("NFD")) {
      if (/[a-z0-9]/.test(c)) {
        out += c
        map.push(i)
      }
    }
  }
  return { out, map }
}
