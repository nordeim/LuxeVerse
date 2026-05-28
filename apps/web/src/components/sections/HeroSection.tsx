"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image — asymmetric framing, left-heavy vignette */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1920&h=1080&fit=crop&q=80"
          alt=""
          role="presentation"
          className="img-cinematic w-full h-full"
          loading="eager"
        />
        {/* Left-heavy cinematic gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-obsidian-950/95 via-obsidian-950/70 to-obsidian-950/30" />
        <div className="absolute inset-0 bg-linear-to-t from-obsidian-950/80 via-transparent to-obsidian-950/30" />
      </div>

      {/* Hero content — LEFT ALIGNED, not centered */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)] py-[var(--space-2xl)]">
        <div className="max-w-2xl">
          {/* Season tag */}
          <p className={`hero-line text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-md)] ${reduced ? "!opacity-100" : ""}`}>
            {locale === "fr" ? "Automne / Hiver 2025" : "Autumn / Winter 2025"}
          </p>

          {/* Main heading — staggered reveal */}
          <h1 className={`text-hero font-display font-light text-obsidian-50 mb-[var(--space-md)] ${reduced ? "!opacity-100" : ""}`}>
            {locale === "fr" ? "Façonné" : "Crafted"}
            <br />
            {locale === "fr" ? "par l'Art," : "by Art,"}
          </h1>

          {/* Horizontal rule — expands on load */}
          <div className={`hero-rule h-px bg-metallic-champagne mb-[var(--space-lg)] ${reduced ? "!opacity-100 !w-24" : ""}`} />

          {/* Subheading */}
          <p className={`hero-line text-2xl md:text-3xl font-display font-light italic text-obsidian-200 mb-[var(--space-xl)] max-w-lg leading-relaxed ${reduced ? "!opacity-100" : ""}`}>
            {locale === "fr" ? "Sélectionné par l'Intelligence" : "Curated by Intelligence"}
          </p>

          {/* CTA — left aligned, not centered */}
          <div className={`hero-line ${reduced ? "!opacity-100" : ""}`}>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-3">
              {locale === "fr" ? "Entrer l'Atelier" : "Enter the Atelier"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator — positioned bottom-left, not centered */}
      <div
        className={`absolute bottom-8 left-6 md:left-[var(--space-xl)] flex items-center gap-3 scroll-indicator ${reduced ? "!opacity-100" : ""}`}
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-linear-to-b from-metallic-champagne to-transparent" />
        <span className="text-xs tracking-[0.2em] uppercase text-obsidian-400">
          {locale === "fr" ? "Défiler" : "Scroll"}
        </span>
      </div>
    </section>
  );
}
