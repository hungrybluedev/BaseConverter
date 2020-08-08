const filesToCache = [
  // Fonts
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  // Icons and images
  "https://hungrybluedev.github.io/BaseConverter/images/info.png",
  // JS
  "https://hungrybluedev.github.io/BaseConverter/scripts/convert.js",
  "https://hungrybluedev.github.io/BaseConverter/scripts/conversion_lib.js",
  // Stylesheets
  "https://hungrybluedev.github.io/BaseConverter/styles/style.css",
  // HTML files
  "https://hungrybluedev.github.io/BaseConverter/convert.html",
  "https://hungrybluedev.github.io/BaseConverter/index.html",
  "https://hungrybluedev.github.io/BaseConverter/",
  // PWA stuff
  "https://hungrybluedev.github.io/BaseConverter/baseconv.webmanifest",
];

const cacheName = "HBDBaseConverterAndArithmetic-v0.0.1";

self.addEventListener("install", (event: Event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
      .catch((_) => {})
  );
});

self.addEventListener("activate", (event: Event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      for (const name of names) {
        if (name !== cacheName) {
          caches.delete(name);
        }
      }
    })
  );
});

self.addEventListener("fetch", (event: Event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
