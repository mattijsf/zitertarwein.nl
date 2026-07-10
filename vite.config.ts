import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const page = (name: string): string => fileURLToPath(new URL(name, import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: { port: 4173 },
  preview: { port: 4173 },
  build: {
    rolldownOptions: {
      // two looks side by side: the classic page and the pop variant
      input: { main: page("index.html"), fris: page("fris.html") },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
})
