import type { ReactElement } from "react";
export function SkipLink(): ReactElement {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[600] focus:bg-obsidian-50 focus:text-obsidian-950 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
