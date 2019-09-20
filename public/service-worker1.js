'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'kcp-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v2';
const _version = 'v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    './',
    './offline.html',
    './index.html',
    './scripts/app.js',
    './scripts/install.js',
    './images/add.svg',
    './images/clear-day.svg',
    './images/clear-night.svg',
    './images/cloudy.svg',
    './images/fog.svg',
    './images/hail.svg',
    './images/install.svg',
    './images/partly-cloudy-day.svg',
    './images/partly-cloudy-night.svg',
    './images/rain.svg',
    './images/refresh.svg',
    './images/sleet.svg',
    './images/snow.svg',
    './images/thunderstorm.svg',
    './images/tornado.svg',
    './images/wind.svg',
];

const log = msg => {
    console.log(`[ServiceWorker ${_version}] ${msg}`);
};

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    // CODELAB: Precache static resources here.
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // CODELAB: Add fetch event handler here.
   /* if (evt.request.url.includes('//')) {
        console.log('[Service Worker] Fetch (data)', evt.request.url);
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(evt.request)
                    .then((response) => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    }).catch((err) => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(evt.request);
                    });
            }));
        return;
    }*/
    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request)
                .then((response) => {
                    return response || fetch(evt.request);
                });
        })
    );


});

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`, event.data);

    const title = 'KCP PWA1111111 Push!!';
    const options = {
        body: `"${event.data.text()}"`,
        icon: '/public/images/icon.png',
        badge: '/public/images/badge.png'
    };

    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://menu.orderpick.kr/menu/table?shopId=S190000031')
    );
});