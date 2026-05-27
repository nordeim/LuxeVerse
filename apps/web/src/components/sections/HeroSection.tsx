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
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1920&h=1080&fit=crop&q=80"
          alt=""
          role="presentation"
          className="img-cinematic w-full h-full"
          loading="eager"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-obsidian-950 via-obsidian-950/60 to-obsidian-950/30" />
        <div className="absolute inset-0 bg-linear-to-r from-obsidian-950/80 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 px-6 md:px-[var(--space-xl)] pb-[var(--space-xl)] md:pb-[var(--space-2xl)] w-full max-w-[1400px]">
        {/* Season tag */}
        <p className={`hero-line text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-md)] ${reduced ? "!opacity-100" : ""}`}>
          {locale === "fr" ? "Automne / Hiver 2025" : "Autumn / Winter 2025"}
        </p>

        {/* Main heading */}
        <h1 className={`text-hero font-display font-light text-obsidian-50 ${reduced ? "!opacity-100" : ""}`}>
          <span className="hero-line block">{locale === "fr" ? "Façonné" : "Crafted"}</span>
          <span className="hero-line block">{locale === "fr" ? "par l'Art," : "by Art,"}</span>
        </h1>

        {/* Horizontal rule */}
        <div className={`hero-rule w-24 h-px bg-metallic-champagne my-[var(--space-md)] ${reduced ? "!opacity-100" : ""}`} />

        {/* Subheading */}
        <p className={`hero-line text-2xl md:text-3xl font-display font-light italic text-obsidian-200 mb-[var(--space-lg)] max-w-lg ${reduced ? "!opacity-100" : ""}`}>
          {locale === "fr" ? "Sélectionné par l'Intelligence" : "Curated by Intelligence"}
        </p>

        {/* CTA */}
        <div className={`hero-line ${reduced ? "!opacity-100" : ""}`}>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-3">
            {locale === "fr" ? "Entrer l'Atelier" : "Enter the Atelier"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator ${reduced ? "!opacity-100" : ""}`}
        aria-hidden="true"
      >
        <span className="text-xs tracking-[0.2em] uppercase text-obsidian-400">
          {locale === "fr" ? "Défiler" : "Scroll"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-obsidian-400"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
