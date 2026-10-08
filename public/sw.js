// Service worker: network first, cache as a safety net (the site keeps
// working offline).
const CACHE = "zitertarwein-v7";
const FILES = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png", "/apple-touch-icon.png", "/plaat-tarwe.webp"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Open Food Facts etc. always go straight to the network
  // The page itself must never come from the HTTP cache: a stale index.html
  // would pair with fresh data files. Assets keep their normal caching.
  const req = e.request.mode === "navigate" ? new Request(e.request, { cache: "no-cache" }) : e.request;
  e.respondWith(
    fetch(req)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
