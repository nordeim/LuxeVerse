"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-obsidian-50" aria-labelledby="brand-story-heading">
      <motion.div style={{ y, opacity }} className="mx-auto max-w-4xl px-4 text-center">
        <h2 id="brand-story-heading" className="text-4xl font-display font-medium text-obsidian-900 mb-8">
          Crafted for the Discerning
        </h2>
        <p className="text-lg text-obsidian-700 leading-relaxed mb-12">
          Every LuxeVerse piece is a dialogue between heritage and innovation. Sourced from ethical ateliers, finished with obsessive precision, and delivered with white-glove care. We don&apos;t follow trends; we archive them.
        </p>
        <div className="relative aspect-video overflow-hidden rounded-xl bg-obsidian-100 shadow-dramatic">
          <Image src="/brand/craftsmanship.jpg" alt="Craftsmanship detail" width={1200} height={675} className="h-full w-full object-cover" />
        </div>
      </motion.div>
    </section>
  );
}
