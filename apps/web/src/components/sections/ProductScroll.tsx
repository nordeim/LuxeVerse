"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  category: string;
}

interface ProductScrollProps {
  products: Product[];
  locale: string;
}

export function ProductScroll({ products, locale }: ProductScrollProps) {
  const heading = locale === "fr" ? "Nouveautés" : "New Arrivals";
  const tag = locale === "fr" ? "Sélectionné" : "Selected";
  const viewAll = locale === "fr" ? "Voir Tout" : "View All";
  const quickView = locale === "fr" ? "Aperçu Rapide" : "Quick View";

  if (products.length === 0) return null;

  return (
    <section
      id="products"
      className="py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800"
      aria-labelledby="products-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)] mb-[var(--space-xl)]">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
              {tag}
            </p>
            <h2
              id="products-heading"
              className="text-4xl md:text-5xl font-display font-light text-obsidian-50"
            >
              {heading}
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-obsidian-300 hover:text-metallic-champagne transition-colors"
          >
            {viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Horizontal product scroll */}
      <div className="product-scroll reveal" role="list" aria-label="New arrivals product list">
        {products.map((product) => (
          <article key={product.id} className="product-card group" role="listitem">
            <div className="overflow-hidden mb-[var(--space-md)] relative">
              <Image
                src={product.image ?? "/images/placeholder-product.png"}
                alt={product.name}
                width={400}
                height={533}
                className="img-product"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-obsidian-950/0 group-hover:bg-obsidian-950/40 transition-all duration-400 flex items-center justify-center">
                <span className="text-xs tracking-[0.2em] uppercase text-obsidian-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {quickView}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-display font-light text-obsidian-100 mb-[var(--space-xs)]">
              {product.name}
            </h3>
            <p className="text-base text-obsidian-400 font-light">
              ${product.price.toLocaleString()}
            </p>
          </article>
        ))}
      </div>

      {/* Mobile "View All" link */}
      <div className="md:hidden mt-[var(--space-lg)] px-6 text-center">
        <Link href="/shop" className="btn-secondary">
          {locale === "fr" ? "Voir Toutes les Nouveautés" : "View All New Arrivals"}
        </Link>
      </div>
    </section>
  );
}
