/** The camera button only shows where the browser can detect barcodes itself. */
export function canScanBarcodes(): boolean {
  return (
    window.BarcodeDetector !== undefined &&
    "mediaDevices" in navigator &&
    "getUserMedia" in navigator.mediaDevices
  )
}
