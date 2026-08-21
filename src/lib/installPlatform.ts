export type InstallPlatform = "ios" | "firefox" | "other"

/** Which install instructions fit this browser. iPadOS reports itself as a Mac with touch. */
export function installPlatform(
  userAgent: string,
  platform: string,
  maxTouchPoints: number
): InstallPlatform {
  if (/iPhone|iPad|iPod/.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1)) {
    return "ios"
  }
  if (/Firefox/i.test(userAgent)) {
    return "firefox"
  }
  return "other"
}
