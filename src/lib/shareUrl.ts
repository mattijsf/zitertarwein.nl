/** Shareable links: ?p=<product> opens the answer straight away. */

const PARAM = "p"

/** The shared product in a query string, or null. */
export function readSharedTerm(search: string): string | null {
  const term = new URLSearchParams(search).get(PARAM)
  return term?.trim() ? term : null
}

/** The query string that shares this product. */
export function shareSearch(name: string): string {
  return `?${PARAM}=${encodeURIComponent(name)}`
}

export function shareUrl(origin: string, name: string): string {
  return `${origin}/${shareSearch(name)}`
}

export function shareText(name: string, verdict: string): string {
  return `Zit er tarwe in ${name}? ${verdict}`
}
