
const CACHE = "student-app-v1";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// Save the app files when the service worker is installed
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(FILES))
    );
});

// Serve saved files first, so the app opens without internet
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((saved) => {
            return saved || fetch(event.request);
        })
    );
});
