import { type ReactNode } from "react";
import { cn } from "@luxeverse/utils";

export interface BadgeProps {
  variant?: "new" | "exclusive" | "limited" | "sustainability" | "default";
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide uppercase",
        variant === "new" && "bg-neon-cyan/10 text-neon-cyan",
        variant === "exclusive" && "bg-metallic-gold/10 text-metallic-gold",
        variant === "limited" && "bg-neon-pink/10 text-neon-pink",
        variant === "sustainability" && "bg-neon-lime/10 text-neon-lime",
        variant === "default" && "bg-obsidian-100 text-obsidian-700",
        className
      )}
    >
      {children}
    </span>
  );
}
