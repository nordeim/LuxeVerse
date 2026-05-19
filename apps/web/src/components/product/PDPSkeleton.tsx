import type { ReactElement } from "react";
export function PDPSkeleton(): ReactElement {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading product details"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[3/4] w-full rounded-lg bg-obsidian-200 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-2/3 rounded bg-obsidian-200 animate-pulse" />
          <div className="h-6 w-1/3 rounded bg-obsidian-200 animate-pulse" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-md bg-obsidian-200 animate-pulse" />
            ))}
          </div>
          <div className="mt-6 h-12 w-full rounded-lg bg-obsidian-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
