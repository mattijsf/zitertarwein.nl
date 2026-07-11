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

void useCatalogStore.getState().loadOffProducts()
registerServiceWorker()
