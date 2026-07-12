/**
 * Levenshtein distance between a and b, bounded by max: anything further apart returns max + 1
 * early, so typo matching over thousands of names stays cheap.
 */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) {
    return max + 1
  }
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const value = Math.min(
        (previous[j] ?? Infinity) + 1,
        (current[j - 1] ?? Infinity) + 1,
        (previous[j - 1] ?? Infinity) + cost
      )
      current[j] = value
      if (value < rowMin) {
        rowMin = value
      }
    }
    if (rowMin > max) {
      return max + 1
    }
    previous = current
  }
  return previous[b.length] ?? max + 1
}
