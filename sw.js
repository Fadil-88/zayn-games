// Zayn's Arcade offline helper (service worker).
// First visit: saves every game on the device. Online: always loads the newest version (and saves it).
// Offline: plays from the saved copy. When adding a new game, add its folder to GAMES below.
const CACHE = "zayn-arcade-v2";
const GAMES = ["dino", "nebula", "chess", "times", "spelling", "balloons", "nails"];
const FILES = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "spelling/words.js", ...GAMES.map(g => g + "/")];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(new Request(f, {cache: "reload"})).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("zayn-arcade") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), ms)); }

async function fromCache(req) {
  const c = await caches.open(CACHE);
  let hit = await c.match(req, {ignoreSearch: true});
  if (!hit && req.mode === "navigate") {
    const u = new URL(req.url);
    if (u.pathname.endsWith("/index.html")) hit = await c.match(u.pathname.slice(0, -10), {ignoreSearch: true});
    else if (!u.pathname.endsWith("/")) hit = await c.match(u.pathname + "/", {ignoreSearch: true});
    if (!hit) hit = await c.match("./");
  }
  return hit;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname === "gc.zgo.at" || url.hostname.endsWith("goatcounter.com")) return; // play counter: online only

  // Fonts: use the saved copy if there is one
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; });
      return hit || net;
    }).catch(() => new Response("", {status: 503})));
    return;
  }

  if (url.origin !== location.origin) return;

  // Arcade files: newest from the internet (saved for later); saved copy if offline or very slow
  e.respondWith((async () => {
    try {
      // fetch by URL: a page request can't be re-sent with new options, and "no-cache" skips GitHub's 10-minute browser cache
      const r = await Promise.race([fetch(req.url, {cache: "no-cache", credentials: "same-origin"}), timeout(4000)]);
      if (r && r.ok) { const c = await caches.open(CACHE); c.put(req, r.clone()); }
      return r;
    } catch (err) {
      const hit = await fromCache(req);
      if (hit) return hit;
      try { return await fetch(req); } catch (e2) {
        return new Response("<h1 style='font-family:sans-serif;text-align:center;margin-top:30vh'>You're offline 🛰️<br><small>This page wasn't saved yet. Go back to the arcade.</small></h1>", {headers: {"Content-Type": "text/html"}});
      }
    }
  })());
});
