"use client";

import { useState, useId } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@luxeverse/utils";

export interface WishlistButtonProps {
  productId: string;
  variantId?: string | null;
  className?: string;
}

export function WishlistButton({ productId, variantId, className }: WishlistButtonProps) {
  const { isInWishlist, toggleItem, isLoading } = useWishlist(productId, variantId);
  const [optimisticFavorited, setOptimisticFavorited] = useState(isInWishlist);
  const buttonId = useId();

  const handleToggle = async (): Promise<void> => {
    setOptimisticFavorited((prev) => !prev);
    try {
      await toggleItem({ productId, variantId: variantId ?? null, addedAt: Date.now() });
    } catch {
      // Revert on error
      setOptimisticFavorited(isInWishlist);
    }
  };

  return (
    <button
      id={buttonId}
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-pressed={optimisticFavorited}
      aria-label={optimisticFavorited ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-full border border-obsidian-200 bg-obsidian-50 text-obsidian-400 transition-all duration-200 ease-luxe hover:border-neon-pink hover:text-neon-pink focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan disabled:opacity-50",
        optimisticFavorited && "border-neon-pink bg-neon-pink/5 text-neon-pink",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={optimisticFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={optimisticFavorited ? 0 : 2}
        className="h-5 w-5 transition-transform duration-200 ease-spring group-hover:scale-110 group-active:scale-90"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}
