const CACHE = "ytp-vocabuddy-zh-en-v3";
const SHELL = ["./", "index.html", "words.js", "srs.js", "csv.js", "answer.js", "manifest.json", "icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("ytp-vocabuddy-") && k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.open(CACHE).then(c => c.match(e.request)).then(hit => hit || fetch(e.request))
  );
});
