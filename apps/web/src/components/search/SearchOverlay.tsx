"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { SearchInput } from "./SearchInput";

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data. In production: fetched via tRPC or passed as props
const RECENT_SEARCHES = ["Obsidian Trench", "Champagne Silk", "Metallic Loafer"];
const TRENDING_SEARCHES = ["Summer Editorial", "Sustainable Linen", "Evening Wear"];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");

  useFocusTrap(isOpen, overlayRef, triggerRef);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-start justify-center pt-24 px-4">
      <div
        className="absolute inset-0 bg-obsidian-950/60 backdrop-blur-md transition-opacity duration-300 ease-luxe"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products and content"
        className="relative w-full max-w-2xl rounded-2xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-dramatic animate-fade-in-up"
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          onClose={onClose}
        />

        {!query && (
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xs font-mono font-medium tracking-widest uppercase text-obsidian-500">Recent</h3>
              <ul className="flex flex-col gap-2">
                {RECENT_SEARCHES.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => { setQuery(term); }}
                      className="w-full text-left text-sm text-obsidian-700 hover:text-neon-cyan transition-colors py-1"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-mono font-medium tracking-widest uppercase text-obsidian-500">Trending</h3>
              <ul className="flex flex-col gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => { setQuery(term); }}
                      className="w-full text-left text-sm text-obsidian-700 hover:text-neon-cyan transition-colors py-1"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
