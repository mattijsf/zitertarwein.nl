import type { ReactElement } from "react"
import "./InstallButton.css"
import { useInstallPrompt } from "./useInstallPrompt"

/** Shown only while the browser offers installation. */
export function InstallButton(): ReactElement {
  const { available, install } = useInstallPrompt()
  return (
    <button
      className="install-button"
      type="button"
      hidden={!available}
      onClick={() => void install()}
    >
      📲 Installeer als app
    </button>
  )
}
