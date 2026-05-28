"use client";

import Link from "next/link";
import { ArrowRight, Heart, Search, Box } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

interface AIChatBubble {
  side: "ai" | "user";
  text: string;
}

interface AIStylistProps {
  locale: string;
}

export function AIStylistSection({ locale }: AIStylistProps) {
  const conversations: AIChatBubble[] =
    locale === "fr"
      ? [
          { side: "user", text: "J'ai une soirée gala demain. Que me suggères-tu ?" },
          { side: "ai", text: "D'après ton profil, un smoking structuré avec une touche de brocart serait parfait. Voici trois options." },
        ]
      : [
          { side: "user", text: "I have a gala dinner tomorrow. What do you suggest?" },
          { side: "ai", text: "Based on your profile, a structured smoking jacket with brocade detailing would be perfect. Here are three options." },
        ];

  const features = [
    { title: "Visual Search", desc: "Upload any image and find pieces that match its mood.", icon: "sparkles" },
    { title: "Style Profiling", desc: "Explicit consent. Zero surveillance. Your taste, your data.", icon: "heart" },
    { title: "3D & AR Try-On", desc: "Experience products in your space before you commit.", icon: "box" },
  ];

  const heading = locale === "fr" ? "Votre Styliste IA" : "Your AI Stylist";
  const tag = locale === "fr" ? "Intelligence Artificielle" : "Artificial Intelligence";

  return (
    <section
      id="atelier"
      className="py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800"
      aria-labelledby="ai-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--space-xl)] items-start">
          {/* Left: Conversational Mock */}
          <div className="md:col-span-6 lg:col-span-5">
            <ScrollReveal>
              <p className="text-xs tracking-[0.3em] uppercase text-neon-cyan font-medium mb-[var(--space-xs)]">
                {tag}
              </p>
              <h2
                id="ai-heading"
                className="text-4xl md:text-5xl font-display font-light text-obsidian-50 mb-[var(--space-lg)] leading-tight"
              >
                {heading}
              </h2>
            </ScrollReveal>

            {/* Chat bubbles */}
            <div className="flex flex-col gap-[var(--space-md)] mb-[var(--space-xl)]">
              {conversations.map((c, i) => (
                <ScrollReveal key={i} delay={i * 0.2} direction={c.side === "user" ? "right" : "left"}>
                  <div
                    className={`chat-bubble ${
                      c.side === "ai" ? "chat-bubble--ai self-start" : "chat-bubble--user self-end"
                    }`}
                  >
                    {c.text}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4}>
              <Link
                href="#"
                className="btn-primary inline-flex items-center gap-2"
              >
                {locale === "fr" ? "Rencontrer Votre Styliste" : "Meet Your Stylist"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: Feature list (desktop) or tabs (mobile) */}
          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-md)]">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 0.15}>
                  <div className="group p-[var(--space-lg)] border border-obsidian-800 hover:border-obsidian-600 transition-colors duration-300 bg-obsidian-900/50 hover:bg-obsidian-800/50 h-full">
                    <div className="mb-[var(--space-sm)] text-neon-cyan">
                      {f.icon === "sparkles" && <Search className="w-5 h-5" />}
                      {f.icon === "heart" && <Heart className="w-5 h-5" />}
                      {f.icon === "box" && <Box className="w-5 h-5" />}
                    </div>
                    <h3 className="text-sm font-medium text-obsidian-100 mb-[var(--space-xs)]">
                      {f.title}
                    </h3>
                    <p className="text-xs text-obsidian-400 font-light leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
