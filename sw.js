const CACHE_NAME = 'lunapos-offline-v2';
const urlsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.jsx',
    './manifest.json',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response; 
            return fetch(event.request).then(fetchRes => {
                if(fetchRes.ok && event.request.method === 'GET') {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchRes.clone());
                        return fetchRes;
                    });
                }
                return fetchRes;
            }).catch(() => new Response('Offline Content Not Available'));
        })
    );
});
