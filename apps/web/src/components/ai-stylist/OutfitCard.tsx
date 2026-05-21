"use client";

import { cn } from "@luxeverse/utils";
import type { OutfitResponse } from "../../lib/ai.types";

interface OutfitCardProps {
  outfit: OutfitResponse | null;
  className?: string;
  onItemClick?: (productId: string) => void;
}

export function OutfitCard({ outfit, className, onItemClick }: OutfitCardProps) {
  if (!outfit) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-obsidian-200 bg-obsidian-50 p-8 text-center",
          className
        )}
      >
        <p className="text-sm text-obsidian-600">
          Ask the AI Stylist to generate your first outfit
        </p>
      </div>
    );
  }

  const { items, totalPrice, confidence, name, mood } = outfit;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-obsidian-200 bg-obsidian-50 p-6",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-medium text-obsidian-900">{name}</h3>
          <p className="text-xs text-obsidian-600">{mood}</p>
        </div>
        <span className="rounded-full bg-obsidian-800 px-2 py-1 text-xs font-medium text-obsidian-100">
          ${totalPrice}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <button
            key={item.productId}
            type="button"
            onClick={() => onItemClick?.(item.productId)}
            className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-obsidian-100 text-left"
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                item.role === "hero"
                  ? "bg-metallic-champagne text-obsidian-950"
                  : item.role === "supporting"
                    ? "bg-obsidian-200 text-obsidian-900"
                    : "bg-obsidian-100 text-obsidian-600"
              )}
            >
              {item.role.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-obsidian-900">{item.name}</span>
              <span className="text-xs text-obsidian-600">{item.reason}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-obsidian-600">
          Confidence: {Math.round(confidence * 100)}%
        </span>
        <div className="h-1.5 w-24 rounded-full bg-obsidian-200">
          <div
            className="h-full rounded-full bg-metallic-gold transition-all duration-500"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
