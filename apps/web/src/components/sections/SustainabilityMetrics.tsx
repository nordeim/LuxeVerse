"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SustainabilityMetricsProps {
  locale: string;
}

export function SustainabilityMetrics({ locale }: SustainabilityMetricsProps) {
  const heading = locale === "fr" ? "Durable par Conception" : "Sustainable by Design";
  const tag = locale === "fr" ? "Conscient" : "Conscious";
  const body =
    locale === "fr"
      ? "Pas une réflexion après coup. Pas un badge. Une proposition de valeur fondamentale mesurée, vérifiée et transparente à chaque étape."
      : "Not an afterthought. Not a badge. A core value proposition measured, verified, and transparent at every step.";
  const cta = locale === "fr" ? "Notre Rapport d'Impact" : "Our Impact Report";

  const metrics = [
    { value: "94", label: locale === "fr" ? "Score de Durabilité" : "Sustainability Score" },
    { value: "78", label: locale === "fr" ? "% Matériaux Recyclés" : "% Recycled Materials" },
    { value: "12", label: locale === "fr" ? "Certifications" : "Certifications" },
    { value: "100", label: locale === "fr" ? "% Compensation Carbone" : "% Carbon Offset" },
  ];

  return (
    <section
      id="sustainability"
      className="py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800"
      aria-labelledby="sustain-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        <div className="reveal text-center mb-[var(--space-2xl)]">
          <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
            {tag}
          </p>
          <h2
            id="sustain-heading"
            className="text-4xl md:text-5xl font-display font-light text-obsidian-50"
          >
            {heading}
          </h2>
          <p className="text-base text-obsidian-400 font-light mt-[var(--space-md)] max-w-xl mx-auto">
            {body}
          </p>
        </div>

        {/* Metrics grid */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-[var(--space-lg)]">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="text-center p-[var(--space-lg)] border border-obsidian-800 hover:border-obsidian-600 transition-colors duration-300"
            >
              <p className="text-4xl md:text-5xl font-display font-light text-metallic-champagne tabular-nums">
                {metric.value}
              </p>
              <p className="text-xs tracking-widest uppercase text-obsidian-400 mt-[var(--space-xs)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="reveal text-center mt-[var(--space-xl)]">
          <Link href="/editorial" className="btn-secondary inline-flex items-center gap-2">
            {cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
