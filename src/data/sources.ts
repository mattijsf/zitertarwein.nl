// Sources the answers point to: verified pages from the Voedingscentrum and the Dutch Coeliac
// Association.
import type { Source } from "../types/product"

export const SOURCES = {
  "vc-gluten": {
    name: "Voedingscentrum — Gluten en het glutenvrij dieet",
    url: "https://www.voedingscentrum.nl/encyclopedie/gluten-en-het-glutenvrij-dieet.aspx",
  },
  "vc-tarwe": {
    name: "Voedingscentrum — Tarwe: volkorenmeel en bloem",
    url: "https://www.voedingscentrum.nl/encyclopedie/tarwe-meel-bloem.aspx",
  },
  ncv: {
    name: "Nederlandse Coeliakie Vereniging (glutenvrij.nl)",
    url: "https://www.glutenvrij.nl/",
  },
} as const satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES
