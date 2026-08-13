import type { ReactElement } from "react"
import type { InstallPlatform } from "../../lib/installPlatform"

/** Manual install steps for browsers without an install prompt. */
export function InstallSteps({ platform }: { platform: InstallPlatform }): ReactElement {
  switch (platform) {
    case "ios":
      return (
        <>
          Open deze site in Safari, tik op de deelknop (vierkantje met pijl omhoog) en kies{" "}
          <strong>‘Zet op beginscherm’</strong>.
        </>
      )
    case "firefox":
      return (
        <>
          Tik op het menu (⋮) van Firefox en kies <strong>‘Toevoegen aan startscherm’</strong>.
        </>
      )
    case "other":
      return (
        <>
          Open het browsermenu en kies <strong>‘App installeren’</strong> of{" "}
          <strong>‘Toevoegen aan startscherm’</strong>.
        </>
      )
  }
}
