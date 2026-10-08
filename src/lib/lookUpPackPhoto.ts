import { field } from "./lookUpOnline"
import { offApiUrl } from "./offApiUrl"

export function packPhotoUrl(code: string): string {
  return offApiUrl(code, "image_front_url")
}

/** The front photo out of a product endpoint response; null when there is none. */
export function parsePackPhoto(json: unknown): string | null {
  if (typeof json !== "object" || json === null) {
    return null
  }
  const product = field(json, "product")
  if (typeof product !== "object" || product === null) {
    return null
  }
  const url = field(product, "image_front_url")
  return typeof url === "string" && url ? url : null
}

/** The pack photo of a product on Open Food Facts (CC BY-SA); null on any failure. */
export async function lookUpPackPhoto(code: string): Promise<string | null> {
  try {
    const res = await fetch(packPhotoUrl(code))
    if (!res.ok) {
      return null
    }
    return parsePackPhoto(await res.json())
  } catch {
    return null
  }
}
