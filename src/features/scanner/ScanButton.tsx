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
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.5h3.2l1.5-2.5h8.6l1.5 2.5H21a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3.6" />
      </svg>
    </button>
  )
}
