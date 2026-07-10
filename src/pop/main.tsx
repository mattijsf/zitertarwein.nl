import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./pop.css"
import { PopApp } from "./PopApp"

const root = document.getElementById("root")
if (!root) {
  throw new Error("#root is missing from fris.html")
}

createRoot(root).render(
  <StrictMode>
    <PopApp />
  </StrictMode>
)
