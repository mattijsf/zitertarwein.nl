import { useEffect, useState } from "react"
import type { BeforeInstallPromptEvent } from "./BeforeInstallPromptEvent"
import { isBeforeInstallPromptEvent } from "./BeforeInstallPromptEvent"

export interface InstallPrompt {
  /** True once the browser offers installation, until it is used or the app is installed. */
  available: boolean
  install: () => Promise<void>
}

/** Holds on to the beforeinstallprompt event so a button can show the prompt later. */
export function useInstallPrompt(): InstallPrompt {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event): void => {
      if (isBeforeInstallPromptEvent(e)) {
        e.preventDefault()
        setPrompt(e)
      }
    }
    const onAppInstalled = (): void => {
      setPrompt(null)
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
    window.addEventListener("appinstalled", onAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
      window.removeEventListener("appinstalled", onAppInstalled)
    }
  }, [])

  return {
    available: prompt !== null,
    install: async () => {
      if (!prompt) {
        return
      }
      await prompt.prompt()
      await prompt.userChoice
      setPrompt(null)
    },
  }
}
