"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@luxeverse/ui";

// Mock data. In production: passed as props from RSC parent
const products = [
  { id: "1", name: "Obsidian Trench", price: 1200, image: "/products/1.jpg" },
  { id: "2", name: "Champagne Silk Blouse", price: 450, image: "/products/2.jpg" },
  { id: "3", name: "Metallic Loafer", price: 680, image: "/products/3.jpg" },
  { id: "4", name: "Noir Leather Bag", price: 950, image: "/products/4.jpg" },
];

export function NewArrivals() {
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

  return (
    <section className="bg-obsidian-50 py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="new-arrivals-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <h2 id="new-arrivals-heading" className="text-3xl font-display font-medium text-obsidian-900">
            New Arrivals
          </h2>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" onClick={() => scroll("left")} disabled={!canScrollLeft} aria-label="Scroll left">←</Button>
            <Button type="button" variant="outline" size="icon" onClick={() => scroll("right")} disabled={!canScrollRight} aria-label="Scroll right">→</Button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {products.map((p) => (
            <article key={p.id} className="flex-shrink-0 w-64 snap-start">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-obsidian-100 mb-3">
                <Image src={p.image} alt={p.name} width={300} height={400} className="h-full w-full object-cover" />
              </div>
              <h3 className="text-base font-medium text-obsidian-900">{p.name}</h3>
              <p className="text-sm text-obsidian-600">${p.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
