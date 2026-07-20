import { create } from "zustand"
import type { BrowseTab } from "../lib/browseLists"

interface BrowseState {
  /** The "Blader door alle producten" sheet is open. */
  open: boolean
  /** Active tab, remembered across close/reopen. */
  tab: BrowseTab
  show: () => void
  hide: () => void
  setTab: (tab: BrowseTab) => void
}

export const useBrowseStore = create<BrowseState>()(set => ({
  open: false,
  tab: "all",
  show: () => {
    set({ open: true })
  },
  hide: () => {
    set({ open: false })
  },
  setTab: tab => {
    set({ tab })
  },
}))
