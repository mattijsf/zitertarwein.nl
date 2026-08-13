import type { ReactElement } from "react"

/** Decorative bars: x, width, height (guard bars run the full 34). */
const BARS: readonly (readonly [number, number, number])[] = [
  [0, 2, 34],
  [4, 1, 34],
  [8, 3, 28],
  [13, 1, 28],
  [16, 2, 28],
  [21, 1, 28],
  [24, 1, 28],
  [27, 3, 28],
  [33, 1, 28],
  [36, 2, 28],
  [41, 3, 28],
  [46, 1, 28],
  [49, 2, 28],
  [54, 1, 28],
  [57, 1, 28],
  [60, 3, 28],
  [66, 2, 28],
  [70, 1, 28],
  [73, 3, 28],
  [78, 1, 28],
  [81, 2, 28],
  [86, 1, 28],
  [90, 1, 34],
  [93, 2, 34],
  [98, 1, 28],
  [101, 3, 28],
  [107, 1, 28],
  [110, 2, 28],
  [115, 1, 28],
  [118, 3, 28],
  [124, 1, 28],
  [127, 2, 28],
  [132, 1, 28],
  [135, 1, 28],
  [139, 3, 28],
  [145, 1, 28],
  [148, 2, 28],
  [153, 3, 28],
  [158, 1, 28],
  [161, 2, 28],
  [166, 1, 28],
  [169, 1, 28],
  [172, 3, 28],
  [178, 2, 28],
  [182, 1, 28],
  [185, 3, 28],
  [190, 1, 28],
  [193, 2, 28],
  [198, 1, 28],
  [201, 3, 28],
  [207, 1, 28],
  [210, 2, 28],
  [215, 1, 28],
  [218, 1, 28],
  [221, 3, 28],
  [227, 2, 28],
  [232, 1, 34],
  [236, 2, 34],
]

/** The barcode every packet ends with. */
export function Barcode(): ReactElement {
  return (
    <svg className="barcode" viewBox="0 0 240 34" preserveAspectRatio="none" aria-hidden="true">
      <g fill="#000">
        {BARS.map(([x, width, height]) => (
          <rect key={x} x={x} y="0" width={width} height={height} />
        ))}
      </g>
    </svg>
  )
}
