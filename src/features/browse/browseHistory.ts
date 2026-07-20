import { useBrowseStore } from "../../stores/useBrowseStore"

function isBrowseEntry(state: unknown): boolean {
  return typeof state === "object" && state !== null && "browse" in state
}

/**
 * The open sheet owns a history entry, so hardware back closes it. Closing goes through
 * history.back(); the popstate listener in BrowseSheet then hides the sheet.
 */
export const browseHistory = {
  open(): void {
    useBrowseStore.getState().show()
    history.pushState({ browse: true }, "")
  },
  back(): void {
    history.back()
  },
  /** After picking a product: pop the browse entry if it is still there. */
  leave(): void {
    if (isBrowseEntry(history.state)) {
      history.back()
    } else {
      useBrowseStore.getState().hide()
    }
  },
}
