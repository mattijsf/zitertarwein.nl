import { nvwaAllergensUrl } from "../data/nvwaAllergensUrl"
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
  {
    name: "NVWA — allergenen op het etiket (EU-verordening 1169/2011)",
    url: nvwaAllergensUrl,
  },
  {
    name: "MDL Fonds — over coeliakie",
    url: "https://www.mdlfonds.nl/ziekten/coeliakie/",
  },
  {
    name: "Stichting Voedselallergie — tarweallergie",
    url: "https://www.voedselallergie.nl/allergenen/tarwe/",
  },
  {
    name: "Thuisarts.nl — coeliakie (medische informatie)",
    url: "https://www.thuisarts.nl/coeliakie",
  },
] as const
