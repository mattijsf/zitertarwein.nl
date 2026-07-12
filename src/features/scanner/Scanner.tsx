import type { ReactElement } from "react"
import { useEffect, useRef, useState } from "react"
import { useCheckStore } from "../../stores/useCheckStore"
import { useScannerStore } from "../../stores/useScannerStore"
import "./Scanner.css"

const FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"]
const DETECT_INTERVAL_MS = 350

/** Camera overlay: detects a barcode in the video and looks it up. */
export function Scanner(): ReactElement {
  const stream = useScannerStore(state => state.stream)
  const stop = useScannerStore(state => state.stop)
  const videoRef = useRef<HTMLVideoElement>(null)
  // the overlay shows once the video plays
  const [playingStream, setPlayingStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const video = videoRef.current
    const Detector = window.BarcodeDetector
    if (!stream || !video || !Detector) {
      return
    }
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | undefined
    video.srcObject = stream
    void video.play().then(
      () => {
        if (cancelled) {
          return
        }
        setPlayingStream(stream)
        const detector = new Detector({ formats: FORMATS })
        timer = setInterval(() => {
          detector.detect(video).then(
            codes => {
              const code = codes[0]?.rawValue
              if (code && !cancelled) {
                cancelled = true
                stop()
                useCheckStore.getState().checkBarcode(code)
              }
            },
            () => {
              // frame not ready yet
            }
          )
        }, DETECT_INTERVAL_MS)
      },
      () => {
        // autoplay refused: close instead of leaving the camera on behind a hidden overlay
        if (!cancelled) {
          stop()
        }
      }
    )
    return () => {
      cancelled = true
      clearInterval(timer)
      video.srcObject = null
    }
  }, [stream, stop])

  const open = stream !== null && playingStream === stream
  useEffect(() => {
    if (!open) {
      return
    }
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        stop()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, stop])

  return (
    <div className="scanner" hidden={!open}>
      <div className="scanner-card">
        <video ref={videoRef} className="scan-video" playsInline muted />
        <p className="scanner-text">Richt de camera op de streepjescode</p>
        <button className="scan-close" type="button" onClick={stop}>
          Sluiten ✕
        </button>
      </div>
    </div>
  )
}
