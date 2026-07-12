import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app/App"
import { registerServiceWorker } from "./features/install/registerServiceWorker"
import { useCatalogStore } from "./stores/useCatalogStore"
import "./styles/global.css"

const root = document.getElementById("root")
if (!root) {
  throw new Error("#root is missing from index.html")
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// the big supermarket list follows once the page has rendered
window.addEventListener("load", () => {
  void useCatalogStore.getState().loadOffProducts()
})
registerServiceWorker()
