"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@luxeverse/utils";

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fade-up" | "scale-in" | "slide-left";
  delay?: number;
  stagger?: boolean;
  className?: string;
}

const variants = {
  "fade-up": { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
  "scale-in": { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  "slide-left": { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
};

export function ScrollReveal({ children, variant = "fade-up", delay = 0, stagger = false, className }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const { initial, animate } = variants[variant];

  const container = {
    animate: stagger ? { transition: { staggerChildren: 0.08, delayChildren: delay } } : {},
  };

  const child = {
    initial: prefersReducedMotion ? {} : initial,
    animate: prefersReducedMotion ? {} : animate,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: stagger ? 0 : delay },
  };

  return (
    <motion.div
      variants={container}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("w-full", className)}
    >
      {stagger ? children : <motion.div variants={child}>{children}</motion.div>}
    </motion.div>
  );
}
