const CACHE_NAME = 'cloudkit-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Bypass for socket.io requests
    if (url.pathname.startsWith('/socket.io/') || url.search.includes('transport=polling')) {
        return;
    }

    // Bypass for API requests (assuming they are dynamic)
    if (url.pathname.startsWith('/api/') || url.pathname.includes('/api/')) {
        return;
    }

    // Bypass for non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Default cache-first strategy for static assets
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
