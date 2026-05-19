"use client";

import { useId, useCallback, useTransition } from "react";
import type { ReactElement } from "react";
import { cn } from "@luxeverse/utils";

export interface VariantOption {
  id: string;
  name: string;
  value: string;
  colorHex?: string | null;
  inventory: number;
}

export interface VariantSelectorProps {
  type: "color" | "size";
  options: VariantOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function VariantSelector({
  type,
  options,
  selectedId,
  onSelect,
}: VariantSelectorProps): ReactElement {
  const groupId = useId();
  const [_isPending, startTransition] = useTransition();

  const handleSelect = useCallback(
    (id: string) => {
      startTransition(() => {
        onSelect(id);
      });
    },
    [onSelect]
  );

  return (
    <div
      role="radiogroup"
      aria-label={`Select ${type}`}
      aria-labelledby={groupId}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const isOutOfStock = opt.inventory === 0;
        const isSelected = selectedId === opt.id;

        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isOutOfStock}
            disabled={isOutOfStock}
            onClick={() => handleSelect(opt.id)}
            className={cn(
              "relative flex items-center justify-center rounded-md border transition-all duration-200 ease-luxe focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan",
              type === "color"
                ? "h-8 w-8"
                : "h-9 min-w-btn-sm px-3 text-sm font-medium",
              isSelected
                ? "border-obsidian-900 ring-1 ring-obsidian-900"
                : "border-obsidian-200 hover:border-obsidian-400",
              isOutOfStock && "opacity-40 cursor-not-allowed"
            )}
          >
            {type === "color" && opt.colorHex ? (
              <span
                className="h-5 w-5 rounded-full border border-obsidian-200"
                style={{ backgroundColor: opt.colorHex }}
                aria-label={opt.name}
              />
            ) : (
              <span className={isOutOfStock ? "line-through" : ""}>
                {opt.value}
              </span>
            )}
            {isOutOfStock && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-px w-4 rotate-45 bg-obsidian-400" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
