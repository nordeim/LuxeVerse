"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EditorialArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
}

interface EditorialSectionProps {
  articles: EditorialArticle[];
  locale: string;
}

export function EditorialSection({ articles, locale }: EditorialSectionProps) {
  const heading = locale === "fr" ? "L'Édition" : "The Edit";
  const tag = locale === "fr" ? "Journal" : "Journal";
  const allArticles = locale === "fr" ? "Tous les Articles" : "All Articles";

  if (articles.length === 0) return null;

  return (
    <section
      id="editorial"
      className="py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800"
      aria-labelledby="editorial-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        <div className="reveal flex items-end justify-between mb-[var(--space-xl)]">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
              {tag}
            </p>
            <h2
              id="editorial-heading"
              className="text-4xl md:text-5xl font-display font-light text-obsidian-50"
            >
              {heading}
            </h2>
          </div>
          <Link
            href="/editorial"
            className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-obsidian-300 hover:text-metallic-champagne transition-colors"
          >
            {allArticles}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-lg)]">
          {articles.map((article) => (
            <article key={article.id} className="reveal group">
              <div className="overflow-hidden aspect-[16/10] mb-[var(--space-md)]">
                <Image
                  src={article.coverImage ?? "/images/placeholder-editorial.png"}
                  alt={article.title}
                  width={800}
                  height={500}
                  className="img-cinematic"
                  loading="lazy"
                />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-metallic-champagne font-medium mb-2">
                {article.category}
              </p>
              <h3 className="text-2xl font-display font-light text-obsidian-50 mb-[var(--space-xs)] group-hover:text-metallic-champagne transition-colors duration-300">
                {article.title}
              </h3>
              <p className="text-base text-obsidian-400 font-light line-clamp-2">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
