"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@luxeverse/ui";

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  category: string;
  brandName?: string | null;
}

interface NewArrivalsClientProps {
  products: Product[];
}

export function NewArrivalsClient({ products }: NewArrivalsClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (products.length === 0) {
    return (
      <section className="bg-obsidian-50 py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="new-arrivals-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="new-arrivals-heading" className="text-3xl font-display font-medium text-obsidian-900">
            New Arrivals
          </h2>
          <p className="mt-4 text-obsidian-600">No new arrivals at the moment. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-obsidian-50 py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="new-arrivals-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <h2 id="new-arrivals-heading" className="text-3xl font-display font-medium text-obsidian-900">
            New Arrivals
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              ←
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              →
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((p) => (
            <article key={p.id} className="shrink-0 w-64 snap-start">
              <Link href={`/shop/${p.category}/${p.slug}`} className="block group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-obsidian-100 mb-3">
                  <Image
                    src={p.image ?? "/placeholder-product.jpg"}
                    alt={p.name}
                    width={300}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base font-medium text-obsidian-900 group-hover:text-metallic-champagne transition-colors">
                  {p.name}
                </h3>
                {p.subtitle && <p className="text-xs text-obsidian-500 mt-0.5">{p.subtitle}</p>}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-medium text-obsidian-900">${p.price}</span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-obsidian-400 line-through">
                      ${p.compareAtPrice}
                    </span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
