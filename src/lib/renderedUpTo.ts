/** How many rows to render, adding whole chunks, so the row at `index` exists. */
export function renderedUpTo(
  rendered: number,
  index: number,
  total: number,
  chunk: number
): number {
  let count = rendered
  while (count <= index && count < total) {
    count = Math.min(count + chunk, total)
  }
  return count
}
