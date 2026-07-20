import type { ReactElement } from "react"
import type { BrowseLists, BrowseTab } from "../../lib/browseLists"
import { BROWSE_TABS } from "../../lib/browseLists"
import { browseLabels } from "./browseLabels"

interface Props {
  lists: BrowseLists
  active: BrowseTab
  onSelect: (tab: BrowseTab) => void
}

export function BrowseTabs({ lists, active, onSelect }: Props): ReactElement {
  return (
    <div className="browse-tabs" role="tablist">
      {BROWSE_TABS.map(tab => (
        <button
          key={tab}
          className={tab === active ? "browse-tab active" : "browse-tab"}
          role="tab"
          type="button"
          onClick={() => {
            onSelect(tab)
          }}
        >
          {browseLabels.tabs[tab]} ({lists[tab].length})
        </button>
      ))}
    </div>
  )
}
