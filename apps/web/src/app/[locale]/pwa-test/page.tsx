"use client";

import { useEffect } from "react";

export default function PWATestPage() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">PWA Test</h1>
      <p className="text-muted-foreground">
        Service Worker registered. Check the console for details.
      </p>
      <div className="mt-4">
        <a
          href="/manifest.json"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          View Manifest
        </a>
      </div>
    </div>
  );
}
