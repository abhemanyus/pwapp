const staticCacheName = 'site-static-v2.6';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  './',
  './index.html',
  './js/app.js',
  './js/ui.js',
  './js/materialize.js',
  './css/materialize.css',
  './css/style.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  './img/icons/favicon-196.png',
  './img/icons/apple-icon-180.png',
  './img/icons/manifest-icon-192.png',
  'https://fonts.gstatic.com/s/materialicons/v98/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  './manifest.json',
  './pages/fallback.html',
  './pages/404.html'
];

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size){
        cache.delete(keys[0]).then(() => {
          limitCacheSize(name, size);
        });
      }
    });
  });
}

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      console.log("pre-caching static assets");
      cache.addAll(assets);
    })
    .catch(err => {console.log('Failed to open cache', err)})
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
        );
    })
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
    .then( cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          console.log('caching dynamic assets', evt.request.url);
          cache.put(evt.request.url, fetchRes.clone())
          .then(() => {limitCacheSize(dynamicCacheName, 15);});
          return fetchRes;
        })
      })
      // .catch(() => caches.match('./pages/404.html'))
    })
    .catch(() => {
      if (evt.request.destination === 'document')
        {
          return caches.match('./pages/fallback.html')
        }
      }
    )
  );
});