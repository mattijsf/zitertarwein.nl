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
      <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true">
        <path
          d="M8.2 6.5 L9.8 3.8 H14.2 L15.8 6.5"
          fill="#fffdf7"
          stroke="#1c1917"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <rect
          x="2"
          y="6.5"
          width="20"
          height="13.5"
          rx="3.5"
          fill="#fffdf7"
          stroke="#1c1917"
          strokeWidth="2.2"
        />
        <circle cx="12" cy="13" r="4.2" fill="#74c0fc" stroke="#1c1917" strokeWidth="2.2" />
        <circle cx="13.4" cy="11.7" r="1.1" fill="#fffdf7" />
      </svg>
    </button>
  )
}
