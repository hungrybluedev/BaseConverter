"use strict";
const filesToCache = [
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
    "https://hungrybluedev.github.io/BaseConverter/images/info.png",
    "https://hungrybluedev.github.io/BaseConverter/scripts/convert.js",
    "https://hungrybluedev.github.io/BaseConverter/scripts/conversion_lib.js",
    "https://hungrybluedev.github.io/BaseConverter/styles/style.css",
    "https://hungrybluedev.github.io/BaseConverter/convert.html",
    "https://hungrybluedev.github.io/BaseConverter/index.html",
    "https://hungrybluedev.github.io/BaseConverter/",
    "https://hungrybluedev.github.io/BaseConverter/baseconv.webmanifest",
];
const cacheName = "HBDBaseConverterAndArithmetic-v0.0.2";
self.addEventListener("install", (event) => {
    event.waitUntil(caches
        .open(cacheName)
        .then((cache) => {
        return cache.addAll(filesToCache);
    })
        .catch((_) => { }));
});
self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((names) => {
        for (const name of names) {
            if (name !== cacheName) {
                caches.delete(name);
            }
        }
    }));
});
self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
    }));
});
