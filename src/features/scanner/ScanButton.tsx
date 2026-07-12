import type { ReactElement } from "react"
import { useScannerStore } from "../../stores/useScannerStore"
import { canScanBarcodes } from "./canScanBarcodes"
import "./ScanButton.css"

const SUPPORTED = canScanBarcodes()

export function ScanButton(): ReactElement | null {
  const start = useScannerStore(state => state.start)
  if (!SUPPORTED) {
    return null
  }
  return (
    <button
      className="scan-button"
      type="button"
      aria-label="Scan een streepjescode"
      title="Scan een streepjescode"
      onClick={() => {
        void start()
      }}
    >
      📷
    </button>
  )
}
