const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
}

/**
 * Decodes HTML entities (&#039;, &#x27;, &amp; ...) that some Open Food Facts names carry.
 * Unknown named entities are left as they are.
 */
export function decodeEntities(s: string): string {
  if (!s.includes("&")) {
    return s
  }
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity: string, body: string) => {
    if (body.startsWith("#")) {
      const hex = body[1] === "x" || body[1] === "X"
      const code = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity
    }
    return NAMED[body.toLowerCase()] ?? entity
  })
}
