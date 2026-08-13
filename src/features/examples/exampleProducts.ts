import { PRODUCTS } from "../../data/products"
import { pickExamples } from "../../lib/pickExamples"

/** "Probeer eens" products, also used by the rotating placeholder. New on every page load. */
export const exampleProducts = pickExamples(PRODUCTS)
