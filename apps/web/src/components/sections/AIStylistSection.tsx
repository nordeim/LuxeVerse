"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Box } from "lucide-react";

interface AIStylistProps {
  locale: string;
}

export function AIStylistSection({ locale }: AIStylistProps) {
  const features =
    locale === "fr"
      ? [
          {
            title: "Recherche Visuelle",
            desc: "Téléchargez une image — trouvez des pièces qui correspondent à son ambiance, sa palette ou sa silhouette",
          },
          {
            title: "Profilage de Style",
            desc: "Consentement explicite, zéro surveillance. Votre goût, vos données, votre contrôle",
          },
          {
            title: "Essayage 3D & RA",
            desc: "Vivez les produits dans votre espace, sur votre corps, avant de vous engager",
          },
        ]
      : [
          {
            title: "Visual Search",
            desc: "Upload any image — find pieces that match its mood, palette, or silhouette",
          },
          {
            title: "Style Profiling",
            desc: "Explicit consent, zero surveillance. Your taste, your data, your control",
          },
          {
            title: "3D & AR Try-On",
            desc: "Experience products in your space, on your body, before you commit",
          },
        ];

  const heading =
    locale === "fr" ? "Votre Atelier Numérique Vous Attend" : "Your Digital Atelier Awaits";
  const tag = locale === "fr" ? "Intelligence" : "Intelligence";
  const cta = locale === "fr" ? "Rencontrer Votre Styliste" : "Meet Your Stylist";

  return (
    <section
      id="atelier"
      className="py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800"
      aria-labelledby="atelier-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--space-xl)] items-center">
          {/* Left: Visual */}
          <div className="reveal md:col-span-5">
            <div className="relative">
              <div className="aspect-[3/4] bg-obsidian-900 relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69b041?w=600&h=800&fit=crop&q=80"
                  alt=""
                  role="presentation"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover opacity-60"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-br from-obsidian-950/80 via-neon-cyan/5 to-metallic-champagne/10" />

                {/* Floating UI elements */}
                <div className="absolute top-[var(--space-lg)] left-[var(--space-lg)] right-[var(--space-lg)] bottom-[var(--space-lg)] border border-obsidian-600/30 rounded-sm flex flex-col justify-between p-[var(--space-md)]">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-neon-cyan font-medium mb-1">
                      AI Stylist
                    </p>
                    <p className="text-2xl font-display font-light text-obsidian-50">
                      Your Personal<br />Curator
                    </p>
                  </div>
                  <div className="space-y-[var(--space-xs)]">
                    <div className="h-1 bg-obsidian-700 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-linear-to-r from-metallic-champagne to-metallic-gold rounded-full" />
                    </div>
                    <p className="text-xs text-obsidian-400">Style match: 94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="reveal md:col-span-7 md:pl-[var(--space-xl)]">
            <p className="text-xs tracking-[0.3em] uppercase text-neon-cyan font-medium mb-[var(--space-xs)]">
              {tag}
            </p>
            <h2
              id="atelier-heading"
              className="text-4xl md:text-5xl font-display font-light text-obsidian-50 mb-[var(--space-lg)]"
              dangerouslySetInnerHTML={{ __html: heading.replace(" ", "<br>") }}
            />
            <div className="w-16 h-px bg-neon-cyan/50 mb-[var(--space-lg)]" />
            <p className="text-base text-obsidian-300 font-light mb-[var(--space-lg)] max-w-lg">
              {locale === "fr"
                ? "Un styliste IA qui apprend votre esthétique, comprend votre style de vie et sélectionne avec l'intuition d'un directeur de mode. Pas d'algorithmes de surveillance — juste une intelligence au service de votre goût."
                : "An AI stylist that learns your aesthetic, understands your lifestyle, and curates with the intuition of a seasoned fashion director. No algorithms that surveillance — just intelligence that serves."}
            </p>
            <ul className="space-y-[var(--space-md)] mb-[var(--space-xl)]" role="list">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-[var(--space-md)]">
                  {i === 0 && <Sparkles className="shrink-0 w-5 h-5 mt-0.5 text-neon-cyan" />}
                  {i === 1 && <Heart className="shrink-0 w-5 h-5 mt-0.5 text-neon-cyan" />}
                  {i === 2 && <Box className="shrink-0 w-5 h-5 mt-0.5 text-neon-cyan" />}
                  <div>
                    <p className="text-obsidian-100 font-medium mb-1 text-sm">{feature.title}</p>
                    <p className="text-xs text-obsidian-400 font-light">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="#" className="btn-primary inline-flex items-center gap-2">
              {cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
