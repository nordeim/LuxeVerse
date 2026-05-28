"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

interface NewsletterSignupProps {
  locale: string;
}

export function NewsletterSignup({ locale }: NewsletterSignupProps) {
  const heading = locale === "fr" ? "Demandez l'Accès" : "Request Access";
  const body =
    locale === "fr"
      ? "Curated arrivals, editorial stories, and private viewing invitations. No noise — only signal."
      : "Curated arrivals, editorial stories, and private viewing invitations. No noise — only signal.";
  const placeholder = locale === "fr" ? "Votre adresse email" : "Your email address";
  const cta = locale === "fr" ? "Demander une Invitation" : "Request an Invitation";
  const privacy = locale === "fr"
    ? "By subscribing, you agree to our privacy policy. Unsubscribe at any time."
    : "By subscribing, you agree to our privacy policy. Unsubscribe at any time.";

  return (
    <section
      id="newsletter"
      className="relative py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800 overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Ambient radial to draw focus */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.82 0.12 80 / 0.04), transparent 70%)",
        }}
      />

      <div className="max-w-[600px] mx-auto px-6 text-center">
        <ScrollReveal>
          <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
            {locale === "fr" ? "Restez Informé" : "Stay Informed"}
          </p>
          <h2
            id="newsletter-heading"
            className="text-3xl md:text-4xl font-display font-light text-obsidian-50 mb-[var(--space-md)]"
          >
            {heading}
          </h2>
          <p className="text-base text-obsidian-400 font-light mb-[var(--space-xl)]">
            {body}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form className="flex flex-col gap-[var(--space-md)]" aria-label="Newsletter signup">
            {/* Animated underline input */}
            <div className="relative">
              <input
                type="email"
                required
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-obsidian-700 text-obsidian-50 text-lg pb-3 pt-1 tracking-wide focus:outline-none focus:border-metallic-champagne transition-colors duration-300 peer"
                aria-label={placeholder}
              />
              <div className="absolute bottom-0 left-0 h-px w-0 bg-metallic-champagne transition-all duration-500 peer-focus:w-full" />
            </div>
            <button
              type="submit"
              className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap self-center"
            >
              {cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-obsidian-500 mt-[var(--space-md)] font-light">{privacy}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
