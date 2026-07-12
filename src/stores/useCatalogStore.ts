import { create } from "zustand"
import { PRODUCTS } from "../data/products"
import { offToProduct } from "../lib/offToProduct"
import type { Product } from "../types/product"

interface CatalogState {
  /** Everything search and suggestions look in: the hand-made list, then supermarket products. */
  products: readonly Product[]
  /** True once the supermarket list has loaded, or failed to. */
  offSettled: boolean
  /** Loads the Open Food Facts products (own chunk) and adds them to the catalog. */
  loadOffProducts: () => Promise<void>
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  products: PRODUCTS,
  offSettled: false,
  loadOffProducts: async () => {
    try {
      const { default: entries } = await import("../data/off-products.json")
      const offProducts = entries.flatMap(entry => offToProduct(entry) ?? [])
      set({ products: [...get().products, ...offProducts], offSettled: true })
    } catch {
      set({ offSettled: true })
    }
  },
}))
