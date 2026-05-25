"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { trpc } from "@/trpc";
import { VisualSearchButton } from "./VisualSearchButton";

export interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function SearchInput({ value, onChange, onClear, onClose }: SearchInputProps) {
  const debouncedQuery = useDebounce(value, 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const router = useRouter();

  // tRPC search suggestions query
  const { data: searchSuggestions } = trpc.search.suggestions.useQuery(
    { q: debouncedQuery, limit: 5 },
    { enabled: debouncedQuery.length > 2, staleTime: 60_000 }
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Wire tRPC suggestions
  useEffect(() => {
    if (debouncedQuery.length > 2 && searchSuggestions) {
      setSuggestions(searchSuggestions.map((s) => s.name));
      setIsExpanded(true);
    } else if (debouncedQuery.length <= 2) {
      setSuggestions([]);
      setIsExpanded(false);
    }
  }, [debouncedQuery, searchSuggestions]);

  const handleSubmit = useCallback((e: React.FormEvent): void => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      onClose();
    }
  }, [value, router, onClose]);

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-3" role="search">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search collections, products, editorial..."
          className="w-full rounded-lg border border-obsidian-200 bg-obsidian-50 px-4 py-3 pr-12 text-base text-obsidian-900 placeholder:text-obsidian-400 focus:border-neon-cyan focus:outline-hidden focus:ring-2 focus:ring-neon-cyan/20 transition-all"
          aria-label="Search"
          aria-expanded={isExpanded}
          aria-controls={listId}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-obsidian-400 hover:text-obsidian-700 transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <VisualSearchButton />

      {isExpanded && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full left-0 right-0 z-10 mt-2 rounded-lg border border-obsidian-200 bg-obsidian-50 p-2 shadow-md animate-fade-in-up"
        >
          {suggestions.map((s, idx) => (
            <li key={idx} role="option" className="px-3 py-2 text-sm text-obsidian-700 hover:bg-obsidian-100 rounded-md cursor-pointer transition-colors">
              {s}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
