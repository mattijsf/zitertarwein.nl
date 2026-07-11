/** Live lookup in the Open Food Facts label data, for products not in our own list. */

/** The fields we ask Open Food Facts for. */
export interface OffProduct {
  code: string
  productName: string
  productNameNl: string
  brands: string
  ingredientsText: string
  ingredientsTextNl: string
  allergensTags: string[]
  ingredientsTags: string[]
}

export interface OnlineMatch {
  /** Product name with the first brand, e.g. "Pindakaas (Calvé)". */
  name: string
  /** The product page on Open Food Facts. */
  url: string
  hasWheat: boolean
}

const SEARCH_URL = "https://nl.openfoodfacts.org/cgi/search.pl"
const FIELDS =
  "code,product_name,product_name_nl,brands,ingredients_text,ingredients_text_nl,allergens_tags,ingredients_tags"
const TIMEOUT_MS = 8000

const WHEAT_IN_TEXT =
  /tarwe|wheat|weizen|blé|froment|durum|semol|spelt|khorasan|kamut|seitan|bulgur|couscous/i
const WHEAT_IN_TAGS = /wheat|spelt|khorasan|triticum/i

function offSearchUrl(term: string): string {
  return (
    `${SEARCH_URL}?search_simple=1&action=process&json=1&page_size=10` +
    `&fields=${FIELDS}&search_terms=${encodeURIComponent(term)}`
  )
}

function firstNonEmpty(...values: string[]): string {
  return values.find(v => v) ?? ""
}

function field(obj: object, key: string): unknown {
  const value: unknown = Reflect.get(obj, key)
  return value
}

function stringField(obj: object, key: string): string {
  const value = field(obj, key)
  return typeof value === "string" ? value : ""
}

function tagsField(obj: object, key: string): string[] {
  const value = field(obj, key)
  if (!Array.isArray(value)) {
    return []
  }
  const list: unknown[] = value
  return list.filter(tag => typeof tag === "string")
}

/** Reads the product list out of a search response; anything malformed is skipped. */
export function parseSearchResponse(json: unknown): OffProduct[] {
  if (typeof json !== "object" || json === null) {
    return []
  }
  const products = field(json, "products")
  if (!Array.isArray(products)) {
    return []
  }
  const list: unknown[] = products
  return list
    .filter((p): p is object => typeof p === "object" && p !== null)
    .map(p => ({
      code: stringField(p, "code"),
      productName: stringField(p, "product_name"),
      productNameNl: stringField(p, "product_name_nl"),
      brands: stringField(p, "brands"),
      ingredientsText: stringField(p, "ingredients_text"),
      ingredientsTextNl: stringField(p, "ingredients_text_nl"),
      allergensTags: tagsField(p, "allergens_tags"),
      ingredientsTags: tagsField(p, "ingredients_tags"),
    }))
}

function ingredients(p: OffProduct): string {
  return firstNonEmpty(p.ingredientsTextNl, p.ingredientsText)
}

/** The first product that has an ingredient list at all. */
export function pickCandidate(products: readonly OffProduct[]): OffProduct | undefined {
  return products.find(p => ingredients(p).trim() || p.ingredientsTags.length)
}

export function hasWheat(p: OffProduct): boolean {
  const tags = [...p.allergensTags, ...p.ingredientsTags].join(" ")
  return WHEAT_IN_TEXT.test(ingredients(p).toLowerCase()) || WHEAT_IN_TAGS.test(tags)
}

export function toMatch(p: OffProduct, term: string): OnlineMatch {
  const name = firstNonEmpty(p.productNameNl, p.productName, term)
  const brand = p.brands ? ` (${p.brands.split(",")[0]?.trim() ?? ""})` : ""
  return {
    name: name + brand,
    url: `https://nl.openfoodfacts.org/product/${encodeURIComponent(p.code)}`,
    hasWheat: hasWheat(p),
  }
}

/**
 * Searches Open Food Facts. Resolves to undefined when nothing with an ingredient list turns up;
 * rejects on network errors and after the timeout.
 */
export async function lookUpOnline(term: string): Promise<OnlineMatch | undefined> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => {
    ctrl.abort()
  }, TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(offSearchUrl(term), { signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
  }
  const json: unknown = await res.json()
  const candidate = pickCandidate(parseSearchResponse(json))
  return candidate && toMatch(candidate, term)
}
