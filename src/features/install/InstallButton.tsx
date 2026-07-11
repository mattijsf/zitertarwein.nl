import type { ReactElement } from "react"
import { installPlatform } from "../../lib/installPlatform"
import { useCheckStore } from "../../stores/useCheckStore"
import "./InstallButton.css"
import { useInstallPrompt } from "./useInstallPrompt"

/** Chromium gets the real install prompt; Firefox and Safari get instructions in the result card. */
export function InstallButton(): ReactElement {
  const { visible, install } = useInstallPrompt()
  const showInstallHelp = useCheckStore(state => state.showInstallHelp)
  const onClick = async (): Promise<void> => {
    if (!(await install())) {
      showInstallHelp(
        installPlatform(navigator.userAgent, navigator.platform, navigator.maxTouchPoints)
      )
    }
  }
  return (
    <button
      className="install-button"
      type="button"
      hidden={!visible}
      onClick={() => void onClick()}
    >
      📲 Installeer als app
    </button>
  )
}
