export type InstallPlatform =
  "ios" | "macSafari" | "firefoxAndroid" | "firefoxDesktop" | "android" | "other"

/** Which install instructions fit this browser. iPadOS reports itself as a Mac with touch. */
export function installPlatform(
  userAgent: string,
  platform: string,
  maxTouchPoints: number
): InstallPlatform {
  if (/iPhone|iPad|iPod/.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1)) {
    return "ios"
  }
  const android = userAgent.includes("Android")
  if (
    userAgent.includes("Macintosh") &&
    userAgent.includes("Safari") &&
    !/Chrome|Chromium|Edg|OPR/.test(userAgent)
  ) {
    return "macSafari"
  }
  if (/Firefox/i.test(userAgent)) {
    return android ? "firefoxAndroid" : "firefoxDesktop"
  }
  return android ? "android" : "other"
}

/** The modifier for the bookmark shortcut: ⌘ on a Mac, Ctrl elsewhere. */
export function bookmarkKey(userAgent: string, platform: string): string {
  return (platform || userAgent).includes("Mac") ? "⌘" : "Ctrl"
}
