import { describe, expect, it } from "vitest"
import { bookmarkKey, installPlatform } from "./installPlatform"

const MAC_SAFARI =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"
const MAC_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36"

describe("installPlatform", () => {
  it("recognises iPhone and iPadOS", () => {
    expect(installPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)", "iPhone", 5)).toBe("ios")
    expect(installPlatform(MAC_SAFARI, "MacIntel", 5)).toBe("ios")
  })

  it("tells Safari on a desktop Mac apart from an iPad and from Chrome on a Mac", () => {
    expect(installPlatform(MAC_SAFARI, "MacIntel", 0)).toBe("macSafari")
    expect(installPlatform(MAC_CHROME, "MacIntel", 0)).toBe("other")
  })

  it("splits Firefox on Android from Firefox on the desktop", () => {
    expect(installPlatform("Mozilla/5.0 (Android 15; Mobile) Firefox/140.0", "Linux", 5)).toBe(
      "firefoxAndroid"
    )
    expect(
      installPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/140.0", "Win32", 0)
    ).toBe("firefoxDesktop")
  })

  it("recognises other Android browsers", () => {
    expect(installPlatform(ANDROID_CHROME, "Linux armv8l", 5)).toBe("android")
  })
})

describe("bookmarkKey", () => {
  it("uses ⌘ on a Mac and Ctrl elsewhere", () => {
    expect(bookmarkKey(MAC_SAFARI, "MacIntel")).toBe("⌘")
    expect(bookmarkKey("Mozilla/5.0 (X11; Linux x86_64) Firefox/140.0", "Linux x86_64")).toBe(
      "Ctrl"
    )
  })

  it("falls back to the user agent when the platform is empty", () => {
    expect(bookmarkKey(MAC_SAFARI, "")).toBe("⌘")
  })
})
