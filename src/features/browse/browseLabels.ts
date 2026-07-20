import type { BrowseTab } from "../../lib/browseLists"
import type { Verdict } from "../../types/product"

export const browseLabels = {
  tabs: { all: "Alle", yes: "Tarwe", no: "Vrij" } satisfies Record<BrowseTab, string>,
  tags: { yes: "Tarwe", no: "Vrij", check: "Check" } satisfies Record<Verdict, string>,
}
