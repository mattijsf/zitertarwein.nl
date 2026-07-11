import { SOURCES } from "../data/sources"

/** The sources listed in the footer. */
export const footerSources = [
  {
    name: "Voedingscentrum — Gluten en het glutenvrij dieet",
    url: SOURCES["vc-gluten"].url,
  },
  {
    name: "Voedingscentrum — Tarwe: volkorenmeel en bloem",
    url: SOURCES["vc-tarwe"].url,
  },
  {
    name: "Nederlandse Coeliakie Vereniging — glutenvrij.nl",
    url: SOURCES.ncv.url,
  },
  {
    name: "Open Food Facts — open etiketdatabase (ODbL)",
    url: SOURCES.off.url,
  },
] as const
