"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  season: string;
}

interface CollectionSpreadProps {
  collections: Collection[];
  locale: string;
}

export function CollectionSpread({ collections, locale }: CollectionSpreadProps) {

  return (
    <section
      id="collections"
      className="py-[var(--space-2xl)] md:py-[8rem]"
      aria-labelledby="collections-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        {/* Section header */}
        <div className="mb-[var(--space-2xl)]">
          <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
            {locale === "fr" ? "Sélectionné" : "Curated"}
          </p>
          <h2
            id="collections-heading"
            className="text-4xl md:text-5xl font-display font-light text-obsidian-50"
          >
            {locale === "fr" ? "Les Collections" : "The Collections"}
          </h2>
        </div>

        {/* Asymmetric oblique grid (1.2 : 0.8 : 1) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-[var(--space-sm)] auto-rows-[280px]">
          {collections.map((collection, i) => (
            <ScrollReveal
              key={collection.id}
              className={
                i === 0 ? "md:row-span-2" : i === 3 ? "md:col-span-2" : ""
              }
              delay={i * 0.1}
            >
              <Link
                href={`/shop/${collection.slug}`}
                className="clip-reveal group relative block h-full overflow-hidden bg-obsidian-900"
              >
                {/* Background image */}
                <Image
                  src={collection.image ?? "/images/placeholder-collection.png"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  style={{ filter: "brightness(0.65) saturate(0.8)" }}
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-obsidian-950/0 group-hover:bg-obsidian-950/40 transition-all duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-[var(--space-lg)]">
                  <p className="text-xs tracking-[0.2em] uppercase text-metallic-champagne font-medium mb-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {collection.season}
                  </p>
                  <h3 className="text-xl md:text-2xl font-display font-light text-obsidian-50">
                    {collection.name}
                  </h3>
                  <div className="w-0 h-px bg-metallic-champagne mt-3 group-hover:w-16 transition-all duration-500" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
