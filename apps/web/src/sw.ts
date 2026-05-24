// This file is the custom service worker entry point for next-pwa
// Build-time injection: @ducanh2912/next-pwa transpiles this to public/sw.js

import { skipWaiting, clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

skipWaiting();
clientsClaim();

// Precache assets from the build manifest
precacheAndRoute([
  { url: "/", revision: null },
  { url: "/manifest.json", revision: null },
]);

// Cache strategies per MEP §4.3:
// - Assets (CSS, JS, fonts) → Cache First
// - API (tRPC, etc.) → Network First
// - Images → Stale-While-Revalidate
// - HTML pages → Network First

registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font",
  new CacheFirst({
    cacheName: "assets",
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api",
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "images",
  })
);

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
  })
);
