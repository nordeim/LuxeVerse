"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cn } from "@luxeverse/utils";

export interface ImageRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  direction?: "left" | "right" | "center";
  className?: string;
}

const clipPaths = {
  left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
  right: { hidden: "inset(0 0% 0 100%)", visible: "inset(0 0% 0 0)" },
  center: { hidden: "inset(0 50% 0 50%)", visible: "inset(0 0% 0 0)" },
};

export function ImageReveal({ src, alt, width, height, direction = "left", className }: ImageRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const { hidden, visible } = clipPaths[direction];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={prefersReducedMotion ? {} : { clipPath: hidden }}
        whileInView={prefersReducedMotion ? {} : { clipPath: visible }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1] }}
        className="w-full h-full"
      >
        <Image src={src} alt={alt} width={width} height={height} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
}
