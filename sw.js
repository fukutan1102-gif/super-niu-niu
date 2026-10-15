// オフラインでも開けるようにする。ページはネット優先（更新をすぐ反映）、フォントなどはキャッシュ優先。
const CACHE = 'snn-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const put = res => { if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then(put).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))); return; }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(put)));
});
