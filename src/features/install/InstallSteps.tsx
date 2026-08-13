import type { ReactElement } from "react"
import type { InstallPlatform } from "../../lib/installPlatform"

const OFFLINE = "Daarna staat de tarwe als app op je scherm — werkt ook offline."

/** Manual install steps for browsers without an install prompt, plus what comes after. */
export function InstallSteps({
  platform,
  bookmarkKey,
}: {
  platform: InstallPlatform
  bookmarkKey: string
}): ReactElement {
  switch (platform) {
    case "ios":
      return (
        <>
          <p>
            Open deze site in Safari, tik op de deelknop (vierkantje met pijl omhoog) en kies{" "}
            <strong>‘Zet op beginscherm’</strong>.
          </p>
          <p>{OFFLINE}</p>
        </>
      )
    case "macSafari":
      return (
        <>
          <p>
            Klik in de knoppenbalk op de deelknop en kies <strong>‘Zet in Dock’</strong> (Safari 17
            of nieuwer).
          </p>
          <p>Daarna staat de tarwe in je Dock — werkt ook offline.</p>
        </>
      )
    case "firefoxAndroid":
      return (
        <>
          <p>
            Tik op het menu (⋮) van Firefox en kies <strong>‘Toevoegen aan startscherm’</strong>.
          </p>
          <p>{OFFLINE}</p>
        </>
      )
    case "firefoxDesktop":
      // desktop Firefox cannot install web apps: no menu item to point at, so say what does work
      return (
        <>
          <p>
            Firefox op de computer kan sites niet als app installeren. Sla deze pagina op met{" "}
            <strong>{bookmarkKey} + D</strong>, of open zitertarwein.nl in Chrome, Edge of Safari om
            er wel een app van te maken.
          </p>
          <p>De site werkt sowieso offline zodra je &apos;m een keer geopend hebt.</p>
        </>
      )
    case "android":
      return (
        <>
          <p>
            Tik op het menu (⋮) van je browser en kies <strong>‘App installeren’</strong> of{" "}
            <strong>‘Toevoegen aan startscherm’</strong>.
          </p>
          <p>{OFFLINE}</p>
        </>
      )
    case "other":
      return (
        <>
          <p>
            Klik op het installatie-icoon in de adresbalk, of open het browsermenu en kies{" "}
            <strong>‘App installeren’</strong>.
          </p>
          <p>{OFFLINE}</p>
        </>
      )
  }
}
