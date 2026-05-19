"use client";

import { useState, useId, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { cn } from "@luxeverse/utils";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetFilterProps {
  name: string;
  label: string;
  options: FacetOption[];
}

export function FacetFilter({ name, label, options }: FacetFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const groupId = useId();

  const selectedValues = searchParams.getAll(name);

  const handleToggle = useCallback((value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(name);

      if (current.includes(value)) {
        params.delete(name);
        current.filter((v) => v !== value).forEach((v) => params.append(name, v));
      } else {
        params.append(name, value);
      }

      params.delete("page"); // Reset pagination on filter change
      router.replace(`/search?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, router, name]);

  return (
    <div className="border-b border-obsidian-200 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-medium text-obsidian-900 hover:text-neon-cyan transition-colors"
        aria-expanded={isOpen}
        aria-controls={`${groupId}-content`}
      >
        <span>{label}</span>
        <span className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "")}>▼</span>
      </button>

      {isOpen && (
        <div id={`${groupId}-content`} role="group" aria-label={`${label} filters`} className="mt-3 flex flex-col gap-2">
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                  isSelected ? "bg-obsidian-100" : "hover:bg-obsidian-50"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(opt.value)}
                  className="h-4 w-4 rounded border-obsidian-300 text-neon-cyan focus:ring-neon-cyan"
                  aria-checked={isSelected}
                />
                <span className="flex-1 text-sm text-obsidian-700">{opt.label}</span>
                <span className="text-xs text-obsidian-400">({opt.count})</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
