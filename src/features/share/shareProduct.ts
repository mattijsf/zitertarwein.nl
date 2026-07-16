import { shareText, shareUrl } from "../../lib/shareUrl"

/** lib.dom types navigator.share as always present; desktop Firefox has none. */
function canShare(): boolean {
  const share: unknown = Reflect.get(navigator, "share")
  return typeof share === "function"
}

/** Web Share where the browser has it, otherwise the clipboard. */
export async function shareProduct(
  name: string,
  verdict: string,
  /** The search the link runs; differs from the name for online answers. */
  query: string
): Promise<"shared" | "copied"> {
  const url = shareUrl(location.origin, query)
  const text = shareText(name, verdict)
  if (canShare()) {
    try {
      await navigator.share({ title: "Zit er tarwe in?", text, url })
    } catch {
      // cancelled by the user
    }
    return "shared"
  }
  await navigator.clipboard.writeText(`${text} ${url}`)
  return "copied"
}
