"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@luxeverse/utils";

export interface TextRevealProps {
  text: string;
  className?: string;
  staggerDelay?: number;
}

export function TextReveal({ text, className, staggerDelay = 0.02 }: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
    },
  };

  const child = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 20, rotateX: 15 },
    visible: prefersReducedMotion ? {} : { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("inline-flex flex-wrap gap-x-2", className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={child} className="inline-block">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
