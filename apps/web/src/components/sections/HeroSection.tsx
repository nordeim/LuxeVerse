"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = prefersReducedMotion ? 0 : 0.75;
      videoRef.current.play().catch(() => {});
    }
  }, [prefersReducedMotion]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-obsidian-950" aria-label="Hero">
      {/* Video Background */}
      <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="h-full w-full object-cover opacity-60"
          onCanPlay={() => {}}
        >
          <source src="/hero-desktop.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-obsidian-950/40 via-transparent to-obsidian-950/80" />
        <div className="absolute inset-0 bg-[url('/grain.png')] opacity-10 mix-blend-overlay" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
          className="text-hero font-display font-light tracking-tight text-metallic-champagne"
        >
          Digital Haute Couture
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
          className="mt-6 max-w-2xl text-lg text-obsidian-100/80"
        >
          Where cinematic storytelling meets intelligent commerce.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.6 }}
          className="mt-10 flex gap-4"
        >
          <MagneticButton strength={0.15} radius={100}>
            <Link href="/shop" className="inline-flex h-12 items-center justify-center rounded-lg bg-metallic-champagne px-8 text-sm font-medium text-obsidian-950 transition-colors hover:bg-metallic-gold">
              Explore Collection
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.15} radius={100}>
            <Link href="/editorial" className="inline-flex h-12 items-center justify-center rounded-lg border border-obsidian-100/30 px-8 text-sm font-medium text-obsidian-100 transition-colors hover:bg-obsidian-100/10">
              Read Editorial
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-obsidian-100/60"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px bg-linear-to-b from-transparent to-metallic-champagne"
        />
      </motion.div>
    </section>
  );
}
