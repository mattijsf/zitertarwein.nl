import type { ReactElement } from "react"
import { code39 } from "../lib/code39"

const HEIGHT = 34
const { bars, width } = code39("GEEN TARWE")

/** A real Code 39 barcode, the way every packet ends. Scan it and it reads: GEEN TARWE. */
export function Barcode(): ReactElement {
  return (
    <svg
      className="barcode"
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Streepjescode die “geen tarwe” spelt"
    >
      <g fill="#000">
        {bars.map(bar => (
          <rect key={bar.x} x={bar.x} width={bar.width} height={HEIGHT} />
        ))}
      </g>
    </svg>
  )
}
