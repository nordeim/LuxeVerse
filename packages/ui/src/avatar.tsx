import { cn } from "@luxeverse/utils";

export interface AvatarProps {
  src?: string | null;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  alt?: string;
}

export function Avatar({
  src,
  fallback = "",
  size = "md",
  shape = "circle",
  alt,
}: AvatarProps) {
  const initials = fallback
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      role="img"
      aria-label={alt || fallback || "Avatar"}
      className={cn(
        "flex items-center justify-center overflow-hidden bg-obsidian-200 text-obsidian-700 font-medium",
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-10 w-10 text-sm",
        size === "lg" && "h-14 w-14 text-base",
        shape === "circle" && "rounded-full",
        shape === "square" && "rounded-md"
      )}
    >
      {src ? (
        <img src={src} alt={alt || fallback} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
