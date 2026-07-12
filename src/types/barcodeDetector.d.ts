// Shape Detection API: not in lib.dom yet. Chromium on Android and macOS has it.
interface DetectedBarcode {
  rawValue: string
}

interface BarcodeDetector {
  detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetector

interface Window {
  BarcodeDetector?: BarcodeDetectorConstructor
}
