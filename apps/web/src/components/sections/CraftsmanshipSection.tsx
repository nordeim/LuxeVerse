"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CraftsmanshipProps {
  locale: string;
}

export function CraftsmanshipSection({ locale }: CraftsmanshipProps) {
  const heading =
    locale === "fr"
      ? "Où l'Artisanat Rencontre sa Parité Digitale"
      : "Where Craftsmanship Meets Its Digital Parity";
  const tag = locale === "fr" ? "Héritage" : "Heritage";
  const body =
    locale === "fr"
      ? "Chaque point numérisé dans les pixels. Chaque texture rendue avec intention. L'expérience digitale doit honorer les mains qui ont façonné l'objet — rien de moins n'est acceptable."
      : "Every stitch preserved in pixels. Every texture rendered with intent. The digital experience must honor the hands that shaped the object — nothing less is acceptable.";
  const cta = locale === "fr" ? "Notre Histoire" : "Our Story";

  return (
    <section
      className="relative py-[var(--space-2xl)] md:py-[10rem] overflow-hidden"
      aria-labelledby="craft-heading"
    >
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1617122836964-e2992f0e0561?w=1920&h=900&fit=crop&q=80"
          alt=""
          role="presentation"
          fill
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-r from-obsidian-950 via-obsidian-950/80 to-obsidian-950/40" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        <div className="max-w-xl">
          <p className="reveal text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
            {tag}
          </p>
          <h2
            id="craft-heading"
            className="reveal text-4xl md:text-5xl font-display font-light text-obsidian-50 mb-[var(--space-lg)]"
            dangerouslySetInnerHTML={{ __html: heading.replace(" ", "<br>") }}
          />
          <div className="reveal w-16 h-px bg-metallic-champagne/50 mb-[var(--space-lg)]" />
          <p className="reveal text-base text-obsidian-200 font-light mb-[var(--space-lg)]">
            {body}
          </p>
          <div className="reveal">
            <Link href="/editorial" className="btn-secondary inline-flex items-center gap-2">
              {cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
