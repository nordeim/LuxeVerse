"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";

interface SustainabilityMetricsProps {
  locale: string;
}

export function SustainabilityMetrics({ locale }: SustainabilityMetricsProps) {
  const heading = locale === "fr" ? "Durable par Conception" : "Sustainable by Design";
  const tag = locale === "fr" ? "Conscient" : "Conscious";

  const metrics = [
    { value: "94", prefix: "", suffix: "", label: locale === "fr" ? "Score de Durabilité" : "Sustainability Score" },
    { value: "78", prefix: "", suffix: "%", label: locale === "fr" ? "Matériaux Recyclés" : "Recycled Materials" },
    { value: "12", prefix: "", suffix: "", label: locale === "fr" ? "Certifications" : "Certifications" },
    { value: "100", prefix: "", suffix: "%", label: locale === "fr" ? "Compensation Carbone" : "Carbon Offset" },
  ];

  return (
    <section
      id="sustainability"
      className="relative py-[var(--space-2xl)] md:py-[8rem] overflow-hidden"
      aria-labelledby="sustain-heading"
    >
      {/* Full-bleed dark base with ambient radial */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.12 0.02 85 / 0.08), transparent 60%)" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        {/* Header — left aligned, editorial */}
        <ScrollReveal className="mb-[var(--space-2xl)]">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-neon-cyan font-medium mb-[var(--space-xs)]">
              {tag}
            </p>
            <h2
              id="sustain-heading"
              className="text-4xl md:text-5xl font-display font-light text-obsidian-50 leading-tight"
            >
              {heading}
            </h2>
            <div className="w-16 h-px bg-neon-cyan/40 mt-[var(--space-md)]" />
          </div>
        </ScrollReveal>

        {/* Floating metric stats — NOT cards, just typographic elements */}
        <div className="flex flex-wrap md:flex-nowrap gap-[var(--space-xl)] md:gap-[var(--space-3xl)] items-baseline">
          {metrics.map((metric, i) => (
            <ScrollReveal key={metric.label} delay={i * 0.15}>
              <div className="text-center md:text-left">
                <p className="stat-float text-5xl md:text-7xl font-display font-light text-metallic-champagne tabular-nums leading-none">
                  {metric.prefix}{metric.value}{metric.suffix}
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-obsidian-400 mt-[var(--space-xs)] font-light">
                  {metric.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
