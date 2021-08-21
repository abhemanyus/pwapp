const staticCacheName = 'site-static';
const assets = [
  './',
  './index.html',
  './pages/about.html',
  './pages/contact.html',
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
  './manifest.json'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      console.log("pre-caching assets");
      cache.addAll(assets);
    })
    .catch(err => {console.log('Failed to open cache', err)})
  );
});

self.addEventListener('activate', evt => {

});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then( cacheRes => {
      return cacheRes || fetch(evt.request)
    })
  );
});