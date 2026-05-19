"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@luxeverse/utils";

export interface BeforeAfterSliderProps {
  before: string;
  after: string;
  altBefore: string;
  altAfter: string;
  width: number;
  height: number;
  className?: string;
}

export function BeforeAfterSlider({ before, after, altBefore, altAfter, width, height, className }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(50);
  const clipPath = useTransform(x, (v: number) => `inset(0 ${100 - v}% 0 0)`);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    x.set(percent);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none overflow-hidden rounded-xl cursor-col-resize", className)}
      onPointerMove={handlePointerMove}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      role="img"
      aria-label="Before and after comparison"
    >
      <Image src={after} alt={altAfter} width={width} height={height} className="h-full w-full object-cover" />
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <Image src={before} alt={altBefore} width={width} height={height} className="h-full w-full object-cover" />
      </motion.div>
      <motion.div
        style={{ left: `${x.get()}%`, x: "-50%" }}
        className="absolute top-0 bottom-0 w-1 bg-metallic-champagne shadow-md"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-obsidian-50 shadow-md">
          <span className="text-xs text-obsidian-900">←</span>
        </div>
      </motion.div>
    </div>
  );
}
