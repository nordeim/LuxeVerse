"use client";

interface MarqueeBandProps {
  locale: string;
}

export function MarqueeBand({ locale }: MarqueeBandProps) {
  const items =
    locale === "fr"
      ? [
          "Atelier Numérique",
          "Commerce Cinématique",
          "Luxé Curé par l'IA",
          "Durable par Conception",
          "Artisanat Parité Digitale",
          "Commerce Narratif",
        ]
      : [
          "Digital Atelier",
          "Cinematic Commerce",
          "AI-Curated Luxury",
          "Sustainable by Design",
          "Craftsmanship Digital Parity",
          "Narrative Commerce",
        ];

  const renderItems = () =>
    items.map((item, i) => (
      <div key={i} className="flex items-center gap-[var(--space-xl)] px-[var(--space-xl)] whitespace-nowrap">
        <span className="text-xl md:text-2xl font-display font-light tracking-wider text-obsidian-300">
          {item}
        </span>
        <div className="diamond" />
      </div>
    ));

  return (
    <div className="border-y border-obsidian-700 py-4 overflow-hidden" aria-hidden="true">
      <div className="marquee-track">
        <div className="flex items-center">{renderItems()}</div>
        <div className="flex items-center">{renderItems()}</div>
      </div>
    </div>
  );
}
