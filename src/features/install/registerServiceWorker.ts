/** Registers public/sw.js (network first, cache as offline fallback). Production only: in dev it would cache Vite's modules. */
export function registerServiceWorker(): void {
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/sw.js")
  }
}
