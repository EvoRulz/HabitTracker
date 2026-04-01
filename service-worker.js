const CACHE = "habit-tracker-v1";

// Added icons and ensuring the path matches GitHub Pages relative structure
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png", // Recommended: ensure these match your actual filenames
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      console.log("Caching assets...");
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE) {
            console.log("Removing old cache:", k);
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Strategy: Cache falling back to Network
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => {
        // Optional: You could return a custom offline page here if needed
      });
    })
  );
});