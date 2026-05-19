import type { ReactElement } from "react";
export function ProductGridSkeleton(): ReactElement {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[3/4] w-full rounded-lg bg-obsidian-200 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-obsidian-200 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-obsidian-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
