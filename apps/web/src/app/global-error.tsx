"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Report to telemetry (Sentry, etc.)
    console.error("[GlobalError] Unhandled error:", error);
    // TODO: Integrate with Sentry or similar error tracking service
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-obsidian-50 text-obsidian-900 antialiased">
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="mx-auto max-w-md text-center">
            <h1 className="font-display text-4xl font-light tracking-tight text-obsidian-950">
              Something went wrong
            </h1>
            <p className="mt-4 text-base text-obsidian-600">
              We encountered an unexpected error. Your session may have expired or
              the service is temporarily unavailable.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="rounded-lg bg-metallic-champagne px-6 py-3 text-sm font-medium text-obsidian-950 transition-colors hover:bg-metallic-gold focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
              >
                Try again
              </button>
              <Link
                href="/"
                className="rounded-lg border border-obsidian-200 bg-white px-6 py-3 text-sm font-medium text-obsidian-900 transition-colors hover:bg-obsidian-50 focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
              >
                Return home
              </Link>
            </div>
            <div className="mt-8 rounded-md bg-obsidian-100 p-4 text-left">
              <p className="text-xs font-mono text-obsidian-400">Error ID</p>
              <p className="mt-1 text-sm font-mono text-obsidian-600">
                {error.digest ?? "unknown"}
              </p>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-left">
                <p className="text-xs font-mono text-red-400">Stack trace</p>
                <pre className="mt-1 max-h-48 overflow-auto text-xs text-red-700">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
