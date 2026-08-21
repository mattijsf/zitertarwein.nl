import { describe, expect, it } from "vitest"
import { installPlatform } from "./installPlatform"

describe("installPlatform", () => {
  it("recognises iPhone and iPadOS", () => {
    expect(installPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)", "iPhone", 5)).toBe("ios")
    expect(installPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X)", "MacIntel", 5)).toBe("ios")
  })

  it("keeps a desktop Mac apart from an iPad", () => {
    expect(installPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X)", "MacIntel", 0)).toBe("other")
  })

  it("recognises Firefox", () => {
    expect(installPlatform("Mozilla/5.0 (Android 15; Mobile) Firefox/140.0", "Linux", 5)).toBe(
      "firefox"
    )
  })
})
