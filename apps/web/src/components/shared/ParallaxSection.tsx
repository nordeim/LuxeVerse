"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@luxeverse/utils";

export interface ParallaxSectionProps {
  children: React.ReactNode;
  depth?: "deep" | "mid" | "surface";
  className?: string;
}

const depthConfig = {
  deep: { y: [0, -80], scale: [1, 1.08] },
  mid: { y: [0, -40], scale: [1, 1.04] },
  surface: { y: [0, -15], scale: [1, 1.01] },
};

export function ParallaxSection({ children, depth = "mid", className }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const config = depthConfig[depth];
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : config.y);
  const scale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : config.scale);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y, scale }} className="w-full">
        {children}
      </motion.div>
    </div>
  );
}
