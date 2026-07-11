/** Last resort: a Google search with the question filled in. */
export function googleUrl(term: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`Zit er tarwe in ${term}?`)}`
}
