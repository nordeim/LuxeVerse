"use client";

import { useState, useCallback } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import { cn } from "@luxeverse/utils";

export interface GalleryImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ProductGalleryProps {
  images: GalleryImage[];
}

export function ProductGallery({ images }: ProductGalleryProps): ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleThumbClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
  }, []);

  if (images.length === 0) {
    return (
      <div
        className="aspect-[3/4] w-full rounded-lg bg-obsidian-100"
        aria-label="No product images available"
      />
    );
  }

  const active = images[activeIndex];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-2 lg:flex-col lg:w-20 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbClick(idx)}
            className={cn(
              "relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200",
              activeIndex === idx
                ? "border-obsidian-900"
                : "border-transparent hover:border-obsidian-300"
            )}
            aria-label={`View image ${idx + 1}`}
          >
            <Image
              src={img.url}
              alt={img.altText ?? ""}
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative flex-1 aspect-[3/4] overflow-hidden rounded-lg bg-obsidian-50 cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={active.url}
          alt={active.altText ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className={cn(
            "object-cover transition-transform duration-500 ease-luxe",
            isZoomed ? "scale-150" : "scale-100"
          )}
          priority
        />
      </div>
    </div>
  );
}
