/**
 * Lower case, accents and all punctuation/whitespace stripped, so "btween" matches "B'tween"
 * and "coca cola" matches "Coca-Cola".
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "")
}
