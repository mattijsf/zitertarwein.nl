import { create } from "zustand"

interface ScannerState {
  /** The camera stream while the scanner is open. */
  stream: MediaStream | null
  /** Asks for the back camera; stays closed without permission or camera. */
  start: () => Promise<void>
  stop: () => void
}

/** Bumped by every start and stop, so a camera that answers late is turned off again. */
let request = 0

function stopTracks(stream: MediaStream | null): void {
  stream?.getTracks().forEach(track => {
    track.stop()
  })
}

export const useScannerStore = create<ScannerState>()((set, get) => ({
  stream: null,
  start: async () => {
    const id = ++request
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      // closed, or tapped again, while the permission prompt was open
      if (id !== request) {
        stopTracks(stream)
        return
      }
      stopTracks(get().stream)
      set({ stream })
    } catch {
      // no permission or no camera
    }
  },
  stop: () => {
    request++
    stopTracks(get().stream)
    set({ stream: null })
  },
}))
