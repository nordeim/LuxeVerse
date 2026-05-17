"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@luxeverse/ui";
import { PriceDisplay } from "./PriceDisplay";
import Image from "next/image";

export interface StickyAddToBarProps {
  productId: string;
  productName: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  onAddToCart: () => void;
  isAdding: boolean;
}

export function StickyAddToBar({
  productName,
  price,
  compareAtPrice,
  imageUrl,
  onAddToCart,
  isAdding,
}: StickyAddToBarProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const addToCartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = addToCartRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return <></>;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-product-bar border-t border-obsidian-200 bg-obsidian-50/95 backdrop-blur-md shadow-sm animate-slide-up"
      role="complementary"
      aria-label="Sticky add to cart bar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={productName}
              width={48}
              height={64}
              className="h-12 w-9 rounded-md object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-obsidian-900 line-clamp-1">
              {productName}
            </span>
            <PriceDisplay
              current={price}
              compareAt={compareAtPrice}
              currency="USD"
            />
          </div>
        </div>
        <Button variant="luxury" onClick={onAddToCart} disabled={isAdding} loading={isAdding}>
          Add to Bag
        </Button>
      </div>
    </div>
  );
}
