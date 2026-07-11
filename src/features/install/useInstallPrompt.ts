import { useEffect, useState } from "react"
import type { BeforeInstallPromptEvent } from "./BeforeInstallPromptEvent"
import { isBeforeInstallPromptEvent } from "./BeforeInstallPromptEvent"

export interface InstallPrompt {
  /** False when the site already runs as an installed app. */
  visible: boolean
  /** Shows Chromium's install prompt. Resolves false when the browser offers none. */
  install: () => Promise<boolean>
}

function runningAsApp(): boolean {
  return (
    matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && navigator.standalone === true)
  )
}

/** Holds on to the beforeinstallprompt event so a button can show the prompt later. */
export function useInstallPrompt(): InstallPrompt {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(() => !runningAsApp())

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event): void => {
      if (isBeforeInstallPromptEvent(e)) {
        e.preventDefault()
        setPrompt(e)
      }
    }
    const onAppInstalled = (): void => {
      setVisible(false)
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
    window.addEventListener("appinstalled", onAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
      window.removeEventListener("appinstalled", onAppInstalled)
    }
  }, [])

  return {
    visible,
    install: async () => {
      if (!prompt) {
        return false
      }
      await prompt.prompt()
      await prompt.userChoice
      setPrompt(null)
      return true
    },
  }
}
