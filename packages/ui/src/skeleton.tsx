import { cn } from "@luxeverse/utils";

export interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  className,
  rounded = "md",
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-obsidian-200",
        rounded === "sm" && "rounded-sm",
        rounded === "md" && "rounded-md",
        rounded === "lg" && "rounded-lg",
        rounded === "full" && "rounded-full",
        className
      )}
      style={{ width, height }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}
