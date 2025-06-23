const CACHE_NAME = "deutsch-lernen-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./dist/app.js",
  "./manifest.json",
  "./assets/Learning-light-bulb.png",
  "./assets/3d-Online-Learning.png",
];

// Install event: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

// Fetch event: serve from cache, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          // Optionally, fallback to offline page or image
          caches.match("./index.html")
        )
      );
    })
  );
});
