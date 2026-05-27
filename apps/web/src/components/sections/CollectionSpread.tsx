"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  const heading = locale === "fr" ? "Collections" : "Collections";
  const tag = locale === "fr" ? "Sélectionné" : "Curated";
  const exploreLabel = locale === "fr" ? "Explorer la Collection" : "Explore Collection";

  if (collections.length === 0) return null;

  return (
    <section
      id="collections"
      className="py-[var(--space-2xl)] md:py-[8rem]"
      aria-labelledby="collections-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        {/* Section heading */}
        <div className="reveal mb-[var(--space-2xl)]">
          <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
            {tag}
          </p>
          <h2
            id="collections-heading"
            className="text-4xl md:text-5xl font-display font-light text-obsidian-50"
          >
            {heading}
          </h2>
        </div>

        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className={`reveal grid grid-cols-1 md:grid-cols-12 gap-[var(--space-lg)] mb-[var(--space-2xl)] items-center ${
              index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            {/* Image */}
            <div
              className={`md:col-span-7 overflow-hidden aspect-[4/5] ${
                index % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              <Image
                src={collection.image ?? "/images/placeholder-collection.png"}
                alt={collection.name}
                width={800}
                height={1000}
                className="img-cinematic"
                loading="lazy"
              />
            </div>

            {/* Text */}
            <div
              className={`md:col-span-5 ${
                index % 2 === 1 ? "md:order-1 md:pr-[var(--space-xl)]" : "md:pl-[var(--space-xl)]"
              } flex flex-col justify-center`}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
                AW25
              </p>
              <h3
                className="text-3xl md:text-4xl font-display font-light text-obsidian-50 mb-[var(--space-md)]"
                dangerouslySetInnerHTML={{
                  __html: collection.name.replace(" ", "<br>"),
                }}
              />
              <div className="w-12 h-px bg-obsidian-600 mb-[var(--space-md)]" />
              <p className="text-base text-obsidian-300 font-light mb-[var(--space-lg)] max-w-md">
                {collection.description}
              </p>
              <Link href={`/shop/${collection.slug}`} className="btn-secondary w-fit inline-flex items-center gap-2">
                {exploreLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
