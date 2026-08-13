import type { ReactElement } from "react"
import { useState } from "react"
import type { InstallPlatform } from "../../lib/installPlatform"
import { bookmarkKey, installPlatform } from "../../lib/installPlatform"
import "./InstallButton.css"
import { InstallSteps } from "./InstallSteps"
import { useInstallPrompt } from "./useInstallPrompt"

/**
 * Chromium gets the real install prompt; Firefox and Safari get the steps right under the
 * button. A second tap closes them again.
 */
export function InstallButton(): ReactElement {
  const { visible, install } = useInstallPrompt()
  const [helpFor, setHelpFor] = useState<InstallPlatform | null>(null)
  const onClick = async (): Promise<void> => {
    if (await install()) {
      return
    }
    const platform = installPlatform(
      navigator.userAgent,
      navigator.platform,
      navigator.maxTouchPoints
    )
    setHelpFor(open => (open ? null : platform))
  }
  return (
    <>
      <button
        className="install-button"
        type="button"
        hidden={!visible}
        aria-expanded={helpFor !== null}
        aria-controls="install-help"
        onClick={() => void onClick()}
      >
        Zet &apos;m als app op je scherm
      </button>
      <div className="install-help" id="install-help" hidden={helpFor === null}>
        {helpFor && (
          <InstallSteps
            platform={helpFor}
            bookmarkKey={bookmarkKey(navigator.userAgent, navigator.platform)}
          />
        )}
      </div>
    </>
  )
}
