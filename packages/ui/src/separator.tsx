import { cn } from "@luxeverse/utils";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  className,
}: SeparatorProps): JSX.Element {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-obsidian-200",
        orientation === "horizontal" && "h-px w-full",
        orientation === "vertical" && "h-full w-px",
        className
      )}
    />
  );
}
