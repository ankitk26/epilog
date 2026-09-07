const CACHE_NAME = "epilog-shell-v1";
const PRECACHE_URLS = [
	"/manifest.webmanifest",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
	"/icons/icon-maskable-512.png",
	"/offline.html",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter((cacheName) => cacheName !== CACHE_NAME)
						.map((cacheName) => caches.delete(cacheName)),
				),
			),
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request).catch(() => caches.match("/offline.html")),
		);
		return;
	}

	const isStaticAsset = ["script", "style", "image", "font"].includes(
		request.destination,
	);
	if (!isStaticAsset) return;

	event.respondWith(
		caches.match(request).then((cachedResponse) => {
			const networkResponse = fetch(request)
				.then((response) => {
					if (response.ok) {
						const responseForCache = response.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(request, responseForCache);
						});
					}
					return response;
				})
				.catch(() => cachedResponse);

			return cachedResponse || networkResponse;
		}),
	);
});
