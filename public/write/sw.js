// 글쓰기 도구를 인터넷 없이도 열 수 있게 보관합니다. (인터넷이 되면 항상 최신본을 받습니다)
const CACHE = 'write-v1';
const FILES = ['/write/', '/write/manifest.webmanifest', '/write/icon-192.png', '/write/icon-512.png', '/favicon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (!(u.pathname.startsWith('/write/') || u.pathname === '/favicon.svg')) return;
  const key = u.pathname === '/write/index.html' ? '/write/' : u.pathname;
  e.respondWith(
    fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return r; })
      .catch(() => caches.match(key, { ignoreSearch: true }))
  );
});
